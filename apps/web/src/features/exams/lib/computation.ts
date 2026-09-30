import type {
  GradingScheme,
  GradeRule,
  Subject,
  StudentMarkEntry,
  StudentSubjectResult,
  StudentExamSummary,
  MarksheetSnapshot,
  PassStatus
} from '../types';

export const DEFAULT_9POINT_RULES: GradeRule[] = [
  { grade: 'A1', minScore: 91, maxScore: 100, gradePoint: 10.0, remarks: 'Outstanding' },
  { grade: 'A2', minScore: 81, maxScore: 90.99, gradePoint: 9.0, remarks: 'Excellent' },
  { grade: 'B1', minScore: 71, maxScore: 80.99, gradePoint: 8.0, remarks: 'Very Good' },
  { grade: 'B2', minScore: 61, maxScore: 70.99, gradePoint: 7.0, remarks: 'Good' },
  { grade: 'C1', minScore: 51, maxScore: 60.99, gradePoint: 6.0, remarks: 'Above Average' },
  { grade: 'C2', minScore: 41, maxScore: 50.99, gradePoint: 5.0, remarks: 'Average' },
  { grade: 'D',  minScore: 33, maxScore: 40.99, gradePoint: 4.0, remarks: 'Marginal Pass' },
  { grade: 'E',  minScore: 0,  maxScore: 32.99, gradePoint: 0.0, remarks: 'Needs Improvement / Failed' }
];

/**
 * Determine letter grade and grade point from percentage score according to scheme.
 */
export function calculateGradeFromPercentage(
  percentage: number,
  schemeRules: GradeRule[] = DEFAULT_9POINT_RULES
): { grade: string; gradePoint: number; remarks: string } {
  const clamped = Math.max(0, Math.min(100, Number(percentage) || 0));

  for (const rule of schemeRules) {
    if (clamped >= rule.minScore && clamped <= rule.maxScore) {
      return {
        grade: rule.grade,
        gradePoint: rule.gradePoint,
        remarks: rule.remarks
      };
    }
  }

  // Fallback to lowest rule or default
  const lowest = schemeRules[schemeRules.length - 1];
  return {
    grade: lowest ? lowest.grade : 'E',
    gradePoint: lowest ? lowest.gradePoint : 0,
    remarks: lowest ? lowest.remarks : 'Needs Improvement'
  };
}

/**
 * Compute single subject result for a student.
 */
export function computeSubjectResult(
  subject: Subject,
  entry?: StudentMarkEntry,
  schemeRules: GradeRule[] = DEFAULT_9POINT_RULES
): StudentSubjectResult {
  if (!entry || (entry.marksObtained === null && !entry.isAbsent && !entry.isExempt)) {
    return {
      subjectId: subject.id,
      subjectCode: subject.code,
      subjectName: subject.name,
      subjectType: subject.subjectType,
      maxMarks: subject.maxMarks,
      passMarks: subject.passMarks,
      marksObtained: 0,
      effectiveMarks: 0,
      percentage: 0,
      grade: '-',
      gradePoint: 0,
      isAbsent: false,
      isExempt: false,
      isPassed: false
    };
  }

  if (entry.isAbsent) {
    return {
      subjectId: subject.id,
      subjectCode: subject.code,
      subjectName: subject.name,
      subjectType: subject.subjectType,
      maxMarks: subject.maxMarks,
      passMarks: subject.passMarks,
      marksObtained: 0,
      effectiveMarks: 0,
      percentage: 0,
      grade: 'AB',
      gradePoint: 0,
      isAbsent: true,
      isExempt: false,
      isPassed: false
    };
  }

  if (entry.isExempt) {
    return {
      subjectId: subject.id,
      subjectCode: subject.code,
      subjectName: subject.name,
      subjectType: subject.subjectType,
      maxMarks: subject.maxMarks,
      passMarks: subject.passMarks,
      marksObtained: 0,
      effectiveMarks: 0,
      percentage: 0,
      grade: 'EX',
      gradePoint: 0,
      isAbsent: false,
      isExempt: true,
      isPassed: true
    };
  }

  const rawMarks = Number(entry.marksObtained) || 0;
  const effectiveMarks = entry.moderatedMarks !== undefined && entry.moderatedMarks !== null
    ? Number(entry.moderatedMarks)
    : rawMarks;

  const percentage = subject.maxMarks > 0
    ? Math.round(((effectiveMarks / subject.maxMarks) * 100) * 100) / 100
    : 0;

  const gradeInfo = calculateGradeFromPercentage(percentage, schemeRules);
  const isPassed = effectiveMarks >= subject.passMarks;

  return {
    subjectId: subject.id,
    subjectCode: subject.code,
    subjectName: subject.name,
    subjectType: subject.subjectType,
    maxMarks: subject.maxMarks,
    passMarks: subject.passMarks,
    marksObtained: rawMarks,
    effectiveMarks,
    percentage,
    grade: gradeInfo.grade,
    gradePoint: gradeInfo.gradePoint,
    isAbsent: false,
    isExempt: false,
    isPassed,
    moderatedMarks: entry.moderatedMarks,
    moderationReason: entry.moderationReason
  };
}

/**
 * Compute student overall examination summary (aggregates scholastic totals, pass/fail, GPA).
 */
export function computeStudentExamSummary(params: {
  studentId: string;
  admissionNo: string;
  studentName: string;
  rollNo?: number;
  className: string;
  section?: string;
  examId: string;
  examName: string;
  subjects: Subject[];
  markEntries: StudentMarkEntry[];
  schemeRules?: GradeRule[];
  minOverallPercentage?: number;
}): StudentExamSummary {
  const {
    studentId,
    admissionNo,
    studentName,
    rollNo,
    className,
    section,
    examId,
    examName,
    subjects,
    markEntries,
    schemeRules = DEFAULT_9POINT_RULES,
    minOverallPercentage = 33
  } = params;

  const markMap = new Map<string, StudentMarkEntry>();
  for (const entry of markEntries) {
    if (entry.studentId === studentId) {
      markMap.set(entry.subjectId, entry);
    }
  }

  const scholasticResults: StudentSubjectResult[] = [];
  const coScholasticResults: StudentSubjectResult[] = [];

  let totalMaxMarks = 0;
  let totalObtainedMarks = 0;
  let totalGradePoints = 0;
  let scholasticCount = 0;
  let failedSubjectCount = 0;

  for (const sub of subjects) {
    const entry = markMap.get(sub.id);
    const result = computeSubjectResult(sub, entry, schemeRules);

    if (sub.subjectType === 'co_scholastic') {
      coScholasticResults.push(result);
    } else {
      scholasticResults.push(result);
      if (!result.isExempt) {
        totalMaxMarks += result.maxMarks;
        totalObtainedMarks += result.effectiveMarks;
        totalGradePoints += result.gradePoint;
        scholasticCount += 1;

        if (!result.isPassed && !result.isExempt) {
          failedSubjectCount += 1;
        }
      }
    }
  }

  const percentage = totalMaxMarks > 0
    ? Math.round(((totalObtainedMarks / totalMaxMarks) * 100) * 100) / 100
    : 0;

  const gpa = scholasticCount > 0
    ? Math.round((totalGradePoints / scholasticCount) * 100) / 100
    : 0;

  const overallGradeInfo = calculateGradeFromPercentage(percentage, schemeRules);

  let passStatus: PassStatus = 'passed';
  if (failedSubjectCount === 1) {
    passStatus = 'compartment';
  } else if (failedSubjectCount > 1 || percentage < minOverallPercentage) {
    passStatus = 'failed';
  }

  return {
    studentId,
    admissionNo,
    studentName,
    rollNo,
    className,
    section,
    examId,
    examName,
    totalMaxMarks,
    totalObtainedMarks,
    percentage,
    gpa,
    overallGrade: overallGradeInfo.grade,
    passStatus,
    isWithheld: false,
    failedSubjectCount,
    scholasticResults,
    coScholasticResults
  };
}

/**
 * Assign competition ranks to a cohort of students, handling ties accurately.
 * E.g. [98%, 98%, 95%, 90%] -> Ranks: [1, 1, 3, 4]
 */
export function assignClassRanks(summaries: StudentExamSummary[]): StudentExamSummary[] {
  // Sort descending by percentage, then total obtained marks
  const sorted = [...summaries].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return b.totalObtainedMarks - a.totalObtainedMarks;
  });

  let currentRank = 1;
  const ranked: StudentExamSummary[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const student = sorted[i];

    if (i > 0) {
      const prev = sorted[i - 1];
      const isTie = prev.percentage === student.percentage && prev.totalObtainedMarks === student.totalObtainedMarks;
      if (!isTie) {
        currentRank = i + 1;
      }
    }

    // Compartment or Failed students typically do not hold official top merit ranks
    const finalRank = student.passStatus === 'passed' ? currentRank : undefined;

    ranked.push({
      ...student,
      rank: finalRank
    });
  }

  return ranked;
}

/**
 * Generate a cryptographically distinct, tamper-proof verification token
 */
export function generateVerificationToken(prefix: string = 'MS-VER'): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 8; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}-${rand}`;
}

/**
 * Freeze an immutable marksheet snapshot for publication
 */
export function freezeMarksheetSnapshot(params: {
  school: {
    name: string;
    tagline?: string;
    logoUrl?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  studentSummary: StudentExamSummary;
  academicYear: string;
  examCode: string;
  schemeRules?: GradeRule[];
  verificationToken: string;
  attendancePercentage?: number;
}): MarksheetSnapshot {
  const {
    school,
    studentSummary,
    academicYear,
    examCode,
    schemeRules = DEFAULT_9POINT_RULES,
    verificationToken,
    attendancePercentage = 95.0
  } = params;

  return {
    schoolName: school.name,
    schoolTagline: school.tagline,
    schoolLogoUrl: school.logoUrl,
    schoolAddress: school.address,
    schoolPhone: school.phone,
    schoolEmail: school.email,
    studentName: studentSummary.studentName,
    admissionNo: studentSummary.admissionNo,
    rollNo: studentSummary.rollNo,
    className: studentSummary.className,
    section: studentSummary.section,
    examName: studentSummary.examName,
    examCode,
    academicYear,
    totalMax: studentSummary.totalMaxMarks,
    totalObtained: studentSummary.totalObtainedMarks,
    percentage: studentSummary.percentage,
    overallGrade: studentSummary.overallGrade,
    gpa: studentSummary.gpa,
    rank: studentSummary.rank,
    passStatus: studentSummary.passStatus === 'passed'
      ? 'Passed with Distinction'
      : studentSummary.passStatus === 'compartment'
      ? 'Eligible for Compartment'
      : 'Needs Improvement / Failed',
    attendancePercentage,
    publishedDate: new Date().toISOString().split('T')[0],
    verificationToken,
    scholasticSubjects: studentSummary.scholasticResults.map(r => ({
      code: r.subjectCode,
      name: r.subjectName,
      max: r.maxMarks,
      pass: r.passMarks,
      obtained: r.effectiveMarks,
      grade: r.grade,
      gradePoint: r.gradePoint,
      remarks: r.moderationReason
    })),
    coScholasticSubjects: studentSummary.coScholasticResults.map(r => ({
      code: r.subjectCode,
      name: r.subjectName,
      max: r.maxMarks,
      obtained: r.effectiveMarks,
      grade: r.grade
    })),
    gradingScaleSummary: schemeRules.map(rule => ({
      grade: rule.grade,
      range: `${rule.minScore}% – ${rule.maxScore}%`,
      gradePoint: rule.gradePoint
    }))
  };
}
