import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGradeFromPercentage,
  computeSubjectResult,
  computeStudentExamSummary,
  assignClassRanks,
  generateVerificationToken,
  freezeMarksheetSnapshot,
  DEFAULT_9POINT_RULES
} from '../apps/web/src/features/exams/lib/computation.ts';
import type { Subject, StudentMarkEntry, GradeRule } from '../apps/web/src/features/exams/types.ts';

describe('Exams & Marks Computation Engine Tests', () => {

  describe('1. Percentage to Grade Conversion', () => {
    it('accurately maps scores to CBSE 9-Point scale bands', () => {
      const g95 = calculateGradeFromPercentage(95, DEFAULT_9POINT_RULES);
      assert.equal(g95.grade, 'A1');
      assert.equal(g95.gradePoint, 10.0);

      const g85 = calculateGradeFromPercentage(85, DEFAULT_9POINT_RULES);
      assert.equal(g85.grade, 'A2');
      assert.equal(g85.gradePoint, 9.0);

      const g75 = calculateGradeFromPercentage(75, DEFAULT_9POINT_RULES);
      assert.equal(g75.grade, 'B1');
      assert.equal(g75.gradePoint, 8.0);

      const g35 = calculateGradeFromPercentage(35, DEFAULT_9POINT_RULES);
      assert.equal(g35.grade, 'D');
      assert.equal(g35.gradePoint, 4.0);

      const g20 = calculateGradeFromPercentage(20, DEFAULT_9POINT_RULES);
      assert.equal(g20.grade, 'E');
      assert.equal(g20.gradePoint, 0.0);
    });

    it('works with custom division-based grading rules', () => {
      const customRules: GradeRule[] = [
        { grade: 'Distinction', minScore: 75, maxScore: 100, gradePoint: 10, remarks: 'Distinction' },
        { grade: '1st Division', minScore: 60, maxScore: 74.99, gradePoint: 8, remarks: 'First' },
        { grade: '2nd Division', minScore: 45, maxScore: 59.99, gradePoint: 6, remarks: 'Second' },
        { grade: 'Pass', minScore: 33, maxScore: 44.99, gradePoint: 4, remarks: 'Pass' },
        { grade: 'Failed', minScore: 0, maxScore: 32.99, gradePoint: 0, remarks: 'Failed' }
      ];

      assert.equal(calculateGradeFromPercentage(82, customRules).grade, 'Distinction');
      assert.equal(calculateGradeFromPercentage(68, customRules).grade, '1st Division');
      assert.equal(calculateGradeFromPercentage(54, customRules).grade, '2nd Division');
      assert.equal(calculateGradeFromPercentage(30, customRules).grade, 'Failed');
    });
  });

  describe('2. Subject Result Calculation with Absent/Exempt/Moderation', () => {
    const mathSubject: Subject = {
      id: 'sub-mth-10',
      tenantId: 't-1',
      code: 'MTH-10',
      name: 'Mathematics',
      subjectType: 'scholastic',
      isOptional: false,
      maxMarks: 100,
      passMarks: 33,
      displayOrder: 1
    };

    it('computes regular marks and percentage correctly', () => {
      const entry: StudentMarkEntry = {
        tenantId: 't-1',
        examId: 'ex-1',
        studentId: 'st-1',
        subjectId: 'sub-mth-10',
        marksObtained: 88,
        isAbsent: false,
        isExempt: false,
        status: 'published'
      };

      const res = computeSubjectResult(mathSubject, entry);
      assert.equal(res.marksObtained, 88);
      assert.equal(res.effectiveMarks, 88);
      assert.equal(res.percentage, 88);
      assert.equal(res.grade, 'A2');
      assert.equal(res.isPassed, true);
    });

    it('handles absent students cleanly', () => {
      const entry: StudentMarkEntry = {
        tenantId: 't-1',
        examId: 'ex-1',
        studentId: 'st-1',
        subjectId: 'sub-mth-10',
        marksObtained: 0,
        isAbsent: true,
        isExempt: false,
        status: 'published'
      };

      const res = computeSubjectResult(mathSubject, entry);
      assert.equal(res.isAbsent, true);
      assert.equal(res.grade, 'AB');
      assert.equal(res.gradePoint, 0);
      assert.equal(res.isPassed, false);
    });

    it('applies moderation adjustments with audit reason', () => {
      const entry: StudentMarkEntry = {
        tenantId: 't-1',
        examId: 'ex-1',
        studentId: 'st-1',
        subjectId: 'sub-mth-10',
        marksObtained: 30, // Was failing
        moderatedMarks: 33, // Grace +3 marks awarded
        moderationReason: 'Annual sports state representative grace award',
        isAbsent: false,
        isExempt: false,
        status: 'published'
      };

      const res = computeSubjectResult(mathSubject, entry);
      assert.equal(res.marksObtained, 30);
      assert.equal(res.effectiveMarks, 33);
      assert.equal(res.isPassed, true);
      assert.equal(res.grade, 'D');
      assert.equal(res.moderationReason, 'Annual sports state representative grace award');
    });
  });

  describe('3. Student Examination Aggregate & Pass/Fail Status', () => {
    const subjects: Subject[] = [
      { id: 'sub-eng', tenantId: 't-1', code: 'ENG', name: 'English', subjectType: 'scholastic', isOptional: false, maxMarks: 100, passMarks: 33, displayOrder: 1 },
      { id: 'sub-mth', tenantId: 't-1', code: 'MTH', name: 'Math', subjectType: 'scholastic', isOptional: false, maxMarks: 100, passMarks: 33, displayOrder: 2 },
      { id: 'sub-sci', tenantId: 't-1', code: 'SCI', name: 'Science', subjectType: 'scholastic', isOptional: false, maxMarks: 100, passMarks: 33, displayOrder: 3 },
      { id: 'sub-ped', tenantId: 't-1', code: 'PED', name: 'PE', subjectType: 'co_scholastic', isOptional: false, maxMarks: 50, passMarks: 17, displayOrder: 4 }
    ];

    it('aggregates scholastic marks and GPA accurately while separating co-scholastic', () => {
      const entries: StudentMarkEntry[] = [
        { tenantId: 't-1', examId: 'e-1', studentId: 'stu-1', subjectId: 'sub-eng', marksObtained: 90, isAbsent: false, isExempt: false, status: 'published' },
        { tenantId: 't-1', examId: 'e-1', studentId: 'stu-1', subjectId: 'sub-mth', marksObtained: 95, isAbsent: false, isExempt: false, status: 'published' },
        { tenantId: 't-1', examId: 'e-1', studentId: 'stu-1', subjectId: 'sub-sci', marksObtained: 85, isAbsent: false, isExempt: false, status: 'published' },
        { tenantId: 't-1', examId: 'e-1', studentId: 'stu-1', subjectId: 'sub-ped', marksObtained: 46, isAbsent: false, isExempt: false, status: 'published' }
      ];

      const summary = computeStudentExamSummary({
        studentId: 'stu-1',
        admissionNo: 'ADM-001',
        studentName: 'Lalrintluanga',
        className: 'Class X',
        examId: 'e-1',
        examName: 'Half Yearly',
        subjects,
        markEntries: entries
      });

      // Scholastic total: 90 + 95 + 85 = 270 / 300
      assert.equal(summary.totalMaxMarks, 300);
      assert.equal(summary.totalObtainedMarks, 270);
      assert.equal(summary.percentage, 90);
      assert.equal(summary.passStatus, 'passed');
      assert.equal(summary.overallGrade, 'A2');
      assert.equal(summary.scholasticResults.length, 3);
      assert.equal(summary.coScholasticResults.length, 1);
    });

    it('identifies compartment when failing exactly one subject', () => {
      const entries: StudentMarkEntry[] = [
        { tenantId: 't-1', examId: 'e-1', studentId: 'stu-2', subjectId: 'sub-eng', marksObtained: 60, isAbsent: false, isExempt: false, status: 'published' },
        { tenantId: 't-1', examId: 'e-1', studentId: 'stu-2', subjectId: 'sub-mth', marksObtained: 28, isAbsent: false, isExempt: false, status: 'published' }, // Failed
        { tenantId: 't-1', examId: 'e-1', studentId: 'stu-2', subjectId: 'sub-sci', marksObtained: 55, isAbsent: false, isExempt: false, status: 'published' }
      ];

      const summary = computeStudentExamSummary({
        studentId: 'stu-2',
        admissionNo: 'ADM-002',
        studentName: 'Zonuna',
        className: 'Class X',
        examId: 'e-1',
        examName: 'Half Yearly',
        subjects,
        markEntries: entries
      });

      assert.equal(summary.failedSubjectCount, 1);
      assert.equal(summary.passStatus, 'compartment');
    });

    it('identifies failure when failing two or more subjects', () => {
      const entries: StudentMarkEntry[] = [
        { tenantId: 't-1', examId: 'e-1', studentId: 'stu-3', subjectId: 'sub-eng', marksObtained: 25, isAbsent: false, isExempt: false, status: 'published' }, // Fail
        { tenantId: 't-1', examId: 'e-1', studentId: 'stu-3', subjectId: 'sub-mth', marksObtained: 20, isAbsent: false, isExempt: false, status: 'published' }, // Fail
        { tenantId: 't-1', examId: 'e-1', studentId: 'stu-3', subjectId: 'sub-sci', marksObtained: 50, isAbsent: false, isExempt: false, status: 'published' }
      ];

      const summary = computeStudentExamSummary({
        studentId: 'stu-3',
        admissionNo: 'ADM-003',
        studentName: 'Mawia',
        className: 'Class X',
        examId: 'e-1',
        examName: 'Half Yearly',
        subjects,
        markEntries: entries
      });

      assert.equal(summary.failedSubjectCount, 2);
      assert.equal(summary.passStatus, 'failed');
    });
  });

  describe('4. Competition Rank Assignment with Ties', () => {
    it('accurately resolves ties using standard competition ranking', () => {
      const baseSummary = {
        totalMaxMarks: 500,
        gpa: 9.0,
        overallGrade: 'A1',
        passStatus: 'passed' as const,
        isWithheld: false,
        failedSubjectCount: 0,
        scholasticResults: [],
        coScholasticResults: [],
        className: 'Class X',
        examId: 'ex-1',
        examName: 'Final'
      };

      const cohorts = [
        { ...baseSummary, studentId: 's1', admissionNo: 'A1', studentName: 'Alice', percentage: 98, totalObtainedMarks: 490 },
        { ...baseSummary, studentId: 's2', admissionNo: 'A2', studentName: 'Bob', percentage: 98, totalObtainedMarks: 490 }, // Tie for 1st
        { ...baseSummary, studentId: 's3', admissionNo: 'A3', studentName: 'Charlie', percentage: 94, totalObtainedMarks: 470 },
        { ...baseSummary, studentId: 's4', admissionNo: 'A4', studentName: 'David', percentage: 89, totalObtainedMarks: 445 },
        { ...baseSummary, studentId: 's5', admissionNo: 'A5', studentName: 'Eve', percentage: 89, totalObtainedMarks: 445 }, // Tie for 4th
        { ...baseSummary, studentId: 's6', admissionNo: 'A6', studentName: 'Frank', percentage: 80, totalObtainedMarks: 400 }
      ];

      const ranked = assignClassRanks(cohorts);

      assert.equal(ranked[0].studentName, 'Alice');
      assert.equal(ranked[0].rank, 1);

      assert.equal(ranked[1].studentName, 'Bob');
      assert.equal(ranked[1].rank, 1); // Tied at 1

      assert.equal(ranked[2].studentName, 'Charlie');
      assert.equal(ranked[2].rank, 3); // Skips to 3

      assert.equal(ranked[3].studentName, 'David');
      assert.equal(ranked[3].rank, 4);

      assert.equal(ranked[4].studentName, 'Eve');
      assert.equal(ranked[4].rank, 4); // Tied at 4

      assert.equal(ranked[5].studentName, 'Frank');
      assert.equal(ranked[5].rank, 6); // Skips to 6
    });
  });

  describe('5. Verification Token Generation & Marksheet Snapshot Integrity', () => {
    it('generates random tamper-proof verification tokens with prefix', () => {
      const token1 = generateVerificationToken('MS-VER');
      const token2 = generateVerificationToken('ID-VER');

      assert.match(token1, /^MS-VER-[A-Z0-9]+-[A-Z0-9]+$/);
      assert.match(token2, /^ID-VER-[A-Z0-9]+-[A-Z0-9]+$/);
      assert.notEqual(token1, token2);
    });

    it('freezes complete immutable snapshot matching report card specifications', () => {
      const summary = {
        studentId: 's-10',
        admissionNo: 'ADM-2024-0012',
        studentName: 'Lalrintluanga Sailo',
        rollNo: 1,
        className: 'Class X',
        section: 'A',
        examId: 'e-100',
        examName: 'Half-Yearly 2024',
        totalMaxMarks: 500,
        totalObtainedMarks: 470,
        percentage: 94.0,
        gpa: 9.8,
        overallGrade: 'A1',
        rank: 1,
        passStatus: 'passed' as const,
        isWithheld: false,
        failedSubjectCount: 0,
        scholasticResults: [
          {
            subjectId: 'sub-1',
            subjectCode: 'MTH-10',
            subjectName: 'Mathematics',
            subjectType: 'scholastic' as const,
            maxMarks: 100,
            passMarks: 33,
            marksObtained: 95,
            effectiveMarks: 95,
            percentage: 95,
            grade: 'A1',
            gradePoint: 10.0,
            isAbsent: false,
            isExempt: false,
            isPassed: true
          }
        ],
        coScholasticResults: []
      };

      const snapshot = freezeMarksheetSnapshot({
        school: {
          name: 'Mount Carmel Higher Secondary School',
          tagline: 'Excellence in Education',
          phone: '+91 98621 11223'
        },
        studentSummary: summary,
        academicYear: '2024-2025',
        examCode: 'HY-2024',
        verificationToken: 'MS-VER-TEST-1234'
      });

      assert.equal(snapshot.schoolName, 'Mount Carmel Higher Secondary School');
      assert.equal(snapshot.studentName, 'Lalrintluanga Sailo');
      assert.equal(snapshot.percentage, 94.0);
      assert.equal(snapshot.overallGrade, 'A1');
      assert.equal(snapshot.verificationToken, 'MS-VER-TEST-1234');
      assert.equal(snapshot.scholasticSubjects[0].obtained, 95);
      assert.equal(snapshot.scholasticSubjects[0].grade, 'A1');
    });
  });

});
