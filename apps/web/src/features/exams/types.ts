export type SubjectType = 'scholastic' | 'co_scholastic';

export interface Subject {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  classId?: string;
  className?: string;
  subjectType: SubjectType;
  isOptional: boolean;
  maxMarks: number;
  passMarks: number;
  displayOrder: number;
}

export type ExamStatus = 'draft' | 'scheduled' | 'ongoing' | 'evaluating' | 'published' | 'locked';

export interface ExamType {
  id: string;
  tenantId: string;
  academicYearId?: string;
  name: string;
  code: string;
  term: string;
  weightagePercent: number;
  startDate?: string;
  endDate?: string;
  status: ExamStatus;
  isPublished: boolean;
  publishedAt?: string;
}

export interface GradeRule {
  grade: string;
  minScore: number;
  maxScore: number;
  gradePoint: number;
  remarks: string;
}

export interface GradingScheme {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isDefault: boolean;
  rules: GradeRule[];
}

export interface StudentMarkEntry {
  id?: string;
  tenantId: string;
  examId: string;
  studentId: string;
  subjectId: string;
  marksObtained: number | null;
  isAbsent: boolean;
  isExempt: boolean;
  moderatedMarks?: number | null;
  moderationReason?: string;
  remarks?: string;
  enteredBy?: string;
  verifiedBy?: string;
  status: 'draft' | 'submitted' | 'verified' | 'published';
}

export interface StudentSubjectResult {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  subjectType: SubjectType;
  maxMarks: number;
  passMarks: number;
  marksObtained: number;
  effectiveMarks: number;
  percentage: number;
  grade: string;
  gradePoint: number;
  isAbsent: boolean;
  isExempt: boolean;
  isPassed: boolean;
  moderatedMarks?: number | null;
  moderationReason?: string;
}

export type PassStatus = 'passed' | 'failed' | 'compartment' | 'withheld';

export interface StudentExamSummary {
  studentId: string;
  admissionNo: string;
  studentName: string;
  rollNo?: number;
  className: string;
  section?: string;
  examId: string;
  examName: string;
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  gpa: number;
  overallGrade: string;
  rank?: number;
  passStatus: PassStatus;
  isWithheld: boolean;
  withheldReason?: string;
  failedSubjectCount: number;
  scholasticResults: StudentSubjectResult[];
  coScholasticResults: StudentSubjectResult[];
}

export interface MarksheetSnapshot {
  schoolName: string;
  schoolTagline?: string;
  schoolLogoUrl?: string;
  schoolAddress?: string;
  schoolPhone?: string;
  schoolEmail?: string;
  studentName: string;
  admissionNo: string;
  rollNo?: number;
  className: string;
  section?: string;
  dob?: string;
  fatherName?: string;
  motherName?: string;
  examName: string;
  examCode: string;
  academicYear: string;
  totalMax: number;
  totalObtained: number;
  percentage: number;
  overallGrade: string;
  gpa: number;
  rank?: number;
  passStatus: string;
  attendancePercentage?: number;
  publishedDate: string;
  verificationToken: string;
  scholasticSubjects: Array<{
    code: string;
    name: string;
    max: number;
    pass: number;
    obtained: number;
    grade: string;
    gradePoint: number;
    remarks?: string;
  }>;
  coScholasticSubjects: Array<{
    code: string;
    name: string;
    max: number;
    obtained: number;
    grade: string;
    remarks?: string;
  }>;
  gradingScaleSummary: Array<{
    grade: string;
    range: string;
    gradePoint: number;
  }>;
}

export interface MarksheetRecord {
  id: string;
  tenantId: string;
  examId: string;
  studentId: string;
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  overallGrade: string;
  gpa?: number;
  rank?: number;
  passStatus: PassStatus;
  isWithheld: boolean;
  withheldReason?: string;
  status: 'draft' | 'submitted' | 'verified' | 'published';
  verificationToken: string;
  snapshotData?: MarksheetSnapshot;
  publishedAt?: string;
  publishedBy?: string;
}
