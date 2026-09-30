'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { MarksheetCardView } from './MarksheetCardView';
import {
  computeStudentExamSummary,
  assignClassRanks,
  freezeMarksheetSnapshot,
  generateVerificationToken,
  DEFAULT_9POINT_RULES
} from '../lib/computation';
import type {
  Subject,
  ExamType,
  StudentMarkEntry,
  StudentExamSummary,
  MarksheetSnapshot,
  GradingScheme
} from '../types';

interface StudentRosterRow {
  studentId: string;
  admissionNo: string;
  rollNo: number;
  fullName: string;
  className: string;
  section: string;
}

export function ExamsMasterView() {
  const [activeTab, setActiveTab] = useState<'entry' | 'marksheets' | 'cycles' | 'audit'>('entry');
  const [selectedExamId, setSelectedExamId] = useState<string>('ex-hy-2024');
  const [selectedClass, setSelectedClass] = useState<string>('Class X');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Selected marksheet for report card preview modal
  const [previewSnapshot, setPreviewSnapshot] = useState<MarksheetSnapshot | null>(null);

  // Moderation modal state
  const [moderationTarget, setModerationTarget] = useState<{
    studentId: string;
    studentName: string;
    subjectId: string;
    subjectName: string;
    currentMarks: number;
  } | null>(null);
  const [moderatedMarksInput, setModeratedMarksInput] = useState<number>(0);
  const [moderationReasonInput, setModerationReasonInput] = useState<string>('');

  // Sample Subjects
  const subjects: Subject[] = [
    { id: 'sub-eng', tenantId: 't-1', code: 'ENG-10', name: 'English Literature', className: 'Class X', subjectType: 'scholastic', isOptional: false, maxMarks: 100, passMarks: 33, displayOrder: 1 },
    { id: 'sub-miz', tenantId: 't-1', code: 'MIZ-10', name: 'Mizo Vernacular', className: 'Class X', subjectType: 'scholastic', isOptional: false, maxMarks: 100, passMarks: 33, displayOrder: 2 },
    { id: 'sub-mth', tenantId: 't-1', code: 'MTH-10', name: 'Mathematics', className: 'Class X', subjectType: 'scholastic', isOptional: false, maxMarks: 100, passMarks: 33, displayOrder: 3 },
    { id: 'sub-sci', tenantId: 't-1', code: 'SCI-10', name: 'Science & Lab', className: 'Class X', subjectType: 'scholastic', isOptional: false, maxMarks: 100, passMarks: 33, displayOrder: 4 },
    { id: 'sub-soc', tenantId: 't-1', code: 'SOC-10', name: 'Social Studies', className: 'Class X', subjectType: 'scholastic', isOptional: false, maxMarks: 100, passMarks: 33, displayOrder: 5 },
    { id: 'sub-csc', tenantId: 't-1', code: 'CSC-10', name: 'Computer Applications', className: 'Class X', subjectType: 'scholastic', isOptional: false, maxMarks: 100, passMarks: 33, displayOrder: 6 },
    { id: 'sub-ped', tenantId: 't-1', code: 'PED-10', name: 'Physical & Health Ed', className: 'Class X', subjectType: 'co_scholastic', isOptional: false, maxMarks: 50, passMarks: 17, displayOrder: 7 }
  ];

  // Sample Students
  const studentsRoster: StudentRosterRow[] = [
    { studentId: 'stu-101', admissionNo: 'ADM-2024-0012', rollNo: 1, fullName: 'Lalrintluanga Sailo', className: 'Class X', section: 'A' },
    { studentId: 'stu-102', admissionNo: 'ADM-2024-0018', rollNo: 2, fullName: 'Vanlalhruaii Pachuau', className: 'Class X', section: 'A' },
    { studentId: 'stu-103', admissionNo: 'ADM-2024-0025', rollNo: 3, fullName: 'Zonunmawia Ralte', className: 'Class X', section: 'A' },
    { studentId: 'stu-104', admissionNo: 'ADM-2024-0033', rollNo: 4, fullName: 'C. Lalthanmawii', className: 'Class X', section: 'A' },
    { studentId: 'stu-105', admissionNo: 'ADM-2024-0041', rollNo: 5, fullName: 'Lalduhawma Fanai', className: 'Class X', section: 'A' }
  ];

  // Marks Matrix
  const [marksState, setMarksState] = useState<Record<string, Record<string, StudentMarkEntry>>>({
    'stu-101': {
      'sub-eng': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-101', subjectId: 'sub-eng', marksObtained: 94, isAbsent: false, isExempt: false, status: 'published' },
      'sub-miz': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-101', subjectId: 'sub-miz', marksObtained: 96, isAbsent: false, isExempt: false, status: 'published' },
      'sub-mth': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-101', subjectId: 'sub-mth', marksObtained: 98, isAbsent: false, isExempt: false, status: 'published' },
      'sub-sci': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-101', subjectId: 'sub-sci', marksObtained: 92, isAbsent: false, isExempt: false, status: 'published' },
      'sub-soc': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-101', subjectId: 'sub-soc', marksObtained: 90, isAbsent: false, isExempt: false, status: 'published' },
      'sub-csc': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-101', subjectId: 'sub-csc', marksObtained: 95, isAbsent: false, isExempt: false, status: 'published' },
      'sub-ped': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-101', subjectId: 'sub-ped', marksObtained: 48, isAbsent: false, isExempt: false, status: 'published' }
    },
    'stu-102': {
      'sub-eng': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-102', subjectId: 'sub-eng', marksObtained: 86, isAbsent: false, isExempt: false, status: 'published' },
      'sub-miz': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-102', subjectId: 'sub-miz', marksObtained: 91, isAbsent: false, isExempt: false, status: 'published' },
      'sub-mth': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-102', subjectId: 'sub-mth', marksObtained: 84, isAbsent: false, isExempt: false, status: 'published' },
      'sub-sci': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-102', subjectId: 'sub-sci', marksObtained: 89, isAbsent: false, isExempt: false, status: 'published' },
      'sub-soc': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-102', subjectId: 'sub-soc', marksObtained: 88, isAbsent: false, isExempt: false, status: 'published' },
      'sub-csc': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-102', subjectId: 'sub-csc', marksObtained: 90, isAbsent: false, isExempt: false, status: 'published' },
      'sub-ped': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-102', subjectId: 'sub-ped', marksObtained: 45, isAbsent: false, isExempt: false, status: 'published' }
    },
    'stu-103': {
      'sub-eng': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-103', subjectId: 'sub-eng', marksObtained: 78, isAbsent: false, isExempt: false, status: 'published' },
      'sub-miz': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-103', subjectId: 'sub-miz', marksObtained: 85, isAbsent: false, isExempt: false, status: 'published' },
      'sub-mth': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-103', subjectId: 'sub-mth', marksObtained: 72, isAbsent: false, isExempt: false, status: 'published' },
      'sub-sci': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-103', subjectId: 'sub-sci', marksObtained: 79, isAbsent: false, isExempt: false, status: 'published' },
      'sub-soc': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-103', subjectId: 'sub-soc', marksObtained: 80, isAbsent: false, isExempt: false, status: 'published' },
      'sub-csc': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-103', subjectId: 'sub-csc', marksObtained: 84, isAbsent: false, isExempt: false, status: 'published' },
      'sub-ped': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-103', subjectId: 'sub-ped', marksObtained: 42, isAbsent: false, isExempt: false, status: 'published' }
    },
    'stu-104': {
      'sub-eng': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-104', subjectId: 'sub-eng', marksObtained: 68, isAbsent: false, isExempt: false, status: 'published' },
      'sub-miz': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-104', subjectId: 'sub-miz', marksObtained: 74, isAbsent: false, isExempt: false, status: 'published' },
      'sub-mth': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-104', subjectId: 'sub-mth', marksObtained: 62, isAbsent: false, isExempt: false, status: 'published' },
      'sub-sci': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-104', subjectId: 'sub-sci', marksObtained: 65, isAbsent: false, isExempt: false, status: 'published' },
      'sub-soc': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-104', subjectId: 'sub-soc', marksObtained: 70, isAbsent: false, isExempt: false, status: 'published' },
      'sub-csc': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-104', subjectId: 'sub-csc', marksObtained: 72, isAbsent: false, isExempt: false, status: 'published' },
      'sub-ped': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-104', subjectId: 'sub-ped', marksObtained: 40, isAbsent: false, isExempt: false, status: 'published' }
    },
    'stu-105': {
      'sub-eng': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-105', subjectId: 'sub-eng', marksObtained: 30, moderatedMarks: 33, moderationReason: 'Annual sports grace marks', isAbsent: false, isExempt: false, status: 'published' },
      'sub-miz': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-105', subjectId: 'sub-miz', marksObtained: 55, isAbsent: false, isExempt: false, status: 'published' },
      'sub-mth': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-105', subjectId: 'sub-mth', marksObtained: 45, isAbsent: false, isExempt: false, status: 'published' },
      'sub-sci': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-105', subjectId: 'sub-sci', marksObtained: 52, isAbsent: false, isExempt: false, status: 'published' },
      'sub-soc': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-105', subjectId: 'sub-soc', marksObtained: 48, isAbsent: false, isExempt: false, status: 'published' },
      'sub-csc': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-105', subjectId: 'sub-csc', marksObtained: 50, isAbsent: false, isExempt: false, status: 'published' },
      'sub-ped': { tenantId: 't-1', examId: 'ex-hy-2024', studentId: 'stu-105', subjectId: 'sub-ped', marksObtained: 38, isAbsent: false, isExempt: false, status: 'published' }
    }
  });

  // Moderation Audit Entries
  const [moderationAuditLog, setModerationAuditLog] = useState<Array<{
    id: string;
    studentName: string;
    admissionNo: string;
    subjectName: string;
    rawMarks: number;
    moderatedMarks: number;
    reason: string;
    adjustedBy: string;
    adjustedAt: string;
  }>>([
    {
      id: 'mod-1',
      studentName: 'Lalduhawma Fanai',
      admissionNo: 'ADM-2024-0041',
      subjectName: 'English Literature',
      rawMarks: 30,
      moderatedMarks: 33,
      reason: 'Annual sports grace marks',
      adjustedBy: 'Principal (Rev. Dr. Lalthansanga)',
      adjustedAt: '2024-09-24 14:30'
    }
  ]);

  // Exam Cycles
  const examCycles: ExamType[] = [
    { id: 'ex-hy-2024', tenantId: 't-1', name: 'Half-Yearly Examination 2024–2025', code: 'HALF-YEARLY-2024', term: 'Term 1', weightagePercent: 50, status: 'published', isPublished: true, publishedAt: '2024-09-25' },
    { id: 'ex-ut1-2024', tenantId: 't-1', name: 'Unit Test 1 (July 2024)', code: 'UT1-2024', term: 'Term 1', weightagePercent: 15, status: 'published', isPublished: true, publishedAt: '2024-07-25' },
    { id: 'ex-ann-2025', tenantId: 't-1', name: 'Annual Board Examination 2024–2025', code: 'ANNUAL-2025', term: 'Term 2', weightagePercent: 100, status: 'draft', isPublished: false }
  ];

  // Grading Schemes
  const gradingSchemes: GradingScheme[] = [
    {
      id: 'gs-cbse-9',
      tenantId: 't-1',
      name: 'CBSE Secondary 9-Point Scale',
      description: 'Standard 9-point percentage band scale with letter grades (A1 to E)',
      isDefault: true,
      rules: DEFAULT_9POINT_RULES
    }
  ];

  // Compute live cohort summaries and ranks
  const computedCohort: StudentExamSummary[] = assignClassRanks(
    studentsRoster.map((student) => {
      const studentMarks = Object.values(marksState[student.studentId] || {});
      return computeStudentExamSummary({
        studentId: student.studentId,
        admissionNo: student.admissionNo,
        studentName: student.fullName,
        rollNo: student.rollNo,
        className: student.className,
        section: student.section,
        examId: selectedExamId,
        examName: examCycles.find(e => e.id === selectedExamId)?.name || 'Examination',
        subjects,
        markEntries: studentMarks
      });
    })
  );

  // Handle Mark Change in Grid
  const handleMarkChange = (studentId: string, subjectId: string, val: string) => {
    const num = val === '' ? null : Number(val);
    const sub = subjects.find(s => s.id === subjectId);
    const max = sub?.maxMarks || 100;

    if (num !== null && num > max) {
      setFeedbackMessage({ text: `Marks cannot exceed maximum marks (${max}) for ${sub?.name}!`, type: 'error' });
      return;
    }

    setMarksState(prev => {
      const studentMap = { ...(prev[studentId] || {}) };
      studentMap[subjectId] = {
        tenantId: 't-1',
        examId: selectedExamId,
        studentId,
        subjectId,
        marksObtained: num,
        isAbsent: false,
        isExempt: false,
        status: 'draft'
      };
      return { ...prev, [studentId]: studentMap };
    });
  };

  // Toggle Absent
  const handleToggleAbsent = (studentId: string, subjectId: string) => {
    setMarksState(prev => {
      const studentMap = { ...(prev[studentId] || {}) };
      const current = studentMap[subjectId];
      const nextAbsent = !current?.isAbsent;
      studentMap[subjectId] = {
        tenantId: 't-1',
        examId: selectedExamId,
        studentId,
        subjectId,
        marksObtained: nextAbsent ? 0 : null,
        isAbsent: nextAbsent,
        isExempt: false,
        status: 'draft'
      };
      return { ...prev, [studentId]: studentMap };
    });
  };

  // Open Moderation Modal
  const openModerationModal = (student: StudentRosterRow, subject: Subject) => {
    const entry = marksState[student.studentId]?.[subject.id];
    setModerationTarget({
      studentId: student.studentId,
      studentName: student.fullName,
      subjectId: subject.id,
      subjectName: subject.name,
      currentMarks: entry?.marksObtained || 0
    });
    setModeratedMarksInput(entry?.moderatedMarks ?? entry?.marksObtained ?? 0);
    setModerationReasonInput(entry?.moderationReason || '');
  };

  // Save Moderation
  const handleSaveModeration = () => {
    if (!moderationTarget) return;
    if (!moderationReasonInput.trim()) {
      setFeedbackMessage({ text: 'Please enter a mandatory audit reason for moderation adjustment.', type: 'error' });
      return;
    }

    setMarksState(prev => {
      const studentMap = { ...(prev[moderationTarget.studentId] || {}) };
      const current = studentMap[moderationTarget.subjectId];
      studentMap[moderationTarget.subjectId] = {
        ...current,
        tenantId: 't-1',
        examId: selectedExamId,
        studentId: moderationTarget.studentId,
        subjectId: moderationTarget.subjectId,
        marksObtained: current?.marksObtained ?? moderationTarget.currentMarks,
        moderatedMarks: moderatedMarksInput,
        moderationReason: moderationReasonInput,
        isAbsent: false,
        isExempt: false,
        status: 'verified'
      };
      return { ...prev, [moderationTarget.studentId]: studentMap };
    });

    setModerationAuditLog(prev => [
      {
        id: `mod-${Date.now()}`,
        studentName: moderationTarget.studentName,
        admissionNo: studentsRoster.find(s => s.studentId === moderationTarget.studentId)?.admissionNo || '',
        subjectName: moderationTarget.subjectName,
        rawMarks: moderationTarget.currentMarks,
        moderatedMarks: moderatedMarksInput,
        reason: moderationReasonInput,
        adjustedBy: 'Principal / Admin',
        adjustedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      },
      ...prev
    ]);

    setModerationTarget(null);
    setFeedbackMessage({ text: `✓ Moderation adjustment saved with immutable audit log.`, type: 'success' });
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Publish Marksheets & Generate Snapshots
  const handlePublishAll = () => {
    setFeedbackMessage({ text: 'Generating tamper-proof snapshots and publishing marksheets for Class X-A...', type: 'info' });
    setTimeout(() => {
      setFeedbackMessage({ text: '✓ Marksheets published successfully! Available immediately in Parent Portal & Verification Center.', type: 'success' });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }, 1200);
  };

  // Preview Student Report Card
  const handlePreviewReportCard = (summary: StudentExamSummary) => {
    const snapshot = freezeMarksheetSnapshot({
      school: {
        name: 'Mount Carmel Higher Secondary School',
        tagline: 'Excellence in Education & Character',
        address: 'Aizawl, Mizoram - 796001',
        phone: '+91 98621 55667',
        email: 'office@mountcarmel.edu.in'
      },
      studentSummary: summary,
      academicYear: '2024-2025',
      examCode: examCycles.find(e => e.id === selectedExamId)?.code || 'EXAM-2024',
      verificationToken: `MS-MC-2024-X-${summary.admissionNo.slice(-4)}-${generateVerificationToken('VER').slice(-8)}`
    });
    setPreviewSnapshot(snapshot);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider">
              Academic Assessment Suite
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 font-bold border border-emerald-300">
              PRO / ULTIMATE
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">
            Exams, Marks & Marksheets
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Keyboard-friendly marks entry, automatic grading & ranking, moderation audit trail, and tamper-proof verification marksheets.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/data-hub"
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
          >
            <span>📥</span>
            <span>Import Marks (Excel)</span>
          </Link>
          <Button variant="primary" size="sm" onClick={handlePublishAll}>
            <span>🚀</span>
            <span>Publish Marksheets</span>
          </Button>
        </div>
      </div>

      {feedbackMessage && (
        <div className={`p-3 rounded-lg text-xs font-semibold border ${
          feedbackMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : feedbackMessage.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-300'
            : 'bg-blue-50 text-blue-800 border-blue-300'
        }`}>
          {feedbackMessage.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-default)] gap-2">
        <button
          onClick={() => setActiveTab('entry')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'entry'
              ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>⌨️</span>
          <span>Marks Entry Grid</span>
        </button>
        <button
          onClick={() => setActiveTab('marksheets')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'marksheets'
              ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>📜</span>
          <span>Marksheets & Report Cards</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            {computedCohort.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('cycles')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'cycles'
              ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>⚙️</span>
          <span>Exam Cycles & Grading</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>🛡️</span>
          <span>Moderation Audit Trail</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
            {moderationAuditLog.length}
          </span>
        </button>
      </div>

      {/* TAB 1: MARKS ENTRY GRID */}
      {activeTab === 'entry' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <Card className="p-4 bg-[var(--bg-surface)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
                  Examination Cycle
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full text-xs font-medium bg-[var(--bg-base)] border border-[var(--border-default)] rounded-lg p-2"
                >
                  {examCycles.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name} ({ex.term})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full text-xs font-medium bg-[var(--bg-base)] border border-[var(--border-default)] rounded-lg p-2"
                >
                  <option value="Class X">Class X</option>
                  <option value="Class IX">Class IX</option>
                  <option value="Class XI">Class XI</option>
                  <option value="Class XII">Class XII</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
                  Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full text-xs font-medium bg-[var(--bg-base)] border border-[var(--border-default)] rounded-lg p-2"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
                  Subject View
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full text-xs font-medium bg-[var(--bg-base)] border border-[var(--border-default)] rounded-lg p-2"
                >
                  <option value="all">Full Curriculum Matrix (All Subjects)</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code}) - Max: {s.maxMarks}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Marks Entry Keyboard-Friendly Tabular Grid */}
          <div className="border border-[var(--border-default)] rounded-xl overflow-hidden shadow-xs bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#163A2B] text-white font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">Roll</th>
                    <th className="py-2.5 px-3 min-w-[160px]">Student Details</th>
                    {subjects
                      .filter(s => selectedSubjectId === 'all' || s.id === selectedSubjectId)
                      .map(sub => (
                        <th key={sub.id} className="py-2.5 px-2 text-center min-w-[110px]">
                          <span className="block font-bold">{sub.code}</span>
                          <span className="block text-[10px] font-normal text-emerald-200">
                            Max: {sub.maxMarks} (Pass: {sub.passMarks})
                          </span>
                        </th>
                      ))}
                    <th className="py-2.5 px-3 text-center min-w-[80px]">Total</th>
                    <th className="py-2.5 px-3 text-center min-w-[70px]">Pct %</th>
                    <th className="py-2.5 px-3 text-center min-w-[60px]">Grade</th>
                    <th className="py-2.5 px-3 text-center min-w-[60px]">Rank</th>
                    <th className="py-2.5 px-3 text-center min-w-[90px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {studentsRoster.map((student) => {
                    const studentSummary = computedCohort.find(c => c.studentId === student.studentId);
                    const studentMarksMap = marksState[student.studentId] || {};

                    return (
                      <tr key={student.studentId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-700">
                          {student.rollNo}
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-semibold text-slate-900 block">{student.fullName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{student.admissionNo}</span>
                        </td>

                        {/* Subject Entry Inputs */}
                        {subjects
                          .filter(s => selectedSubjectId === 'all' || s.id === selectedSubjectId)
                          .map(sub => {
                            const entry = studentMarksMap[sub.id];
                            const marksVal = entry?.marksObtained ?? '';
                            const isAbsent = entry?.isAbsent;
                            const isModerated = entry?.moderatedMarks !== undefined && entry?.moderatedMarks !== null;

                            return (
                              <td key={sub.id} className="py-2 px-1.5 text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <div className="relative flex items-center">
                                    <input
                                      type={isAbsent ? 'text' : 'number'}
                                      disabled={isAbsent}
                                      value={isAbsent ? 'AB' : marksVal}
                                      onChange={(e) => handleMarkChange(student.studentId, sub.id, e.target.value)}
                                      className={`w-14 text-center font-mono text-xs font-bold py-1 border rounded transition-colors ${
                                        isAbsent
                                          ? 'bg-rose-100 text-rose-700 border-rose-300 font-bold'
                                          : isModerated
                                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                                          : 'bg-white border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                                      }`}
                                      placeholder="—"
                                      min={0}
                                      max={sub.maxMarks}
                                    />
                                    {isModerated && (
                                      <span
                                        title={`Moderated from ${entry?.marksObtained} to ${entry?.moderatedMarks}: ${entry?.moderationReason}`}
                                        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 cursor-pointer"
                                      />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 text-[9px]">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAbsent(student.studentId, sub.id)}
                                      className={`px-1 py-0.5 rounded text-[8px] font-semibold ${
                                        isAbsent
                                          ? 'bg-rose-600 text-white'
                                          : 'text-slate-500 hover:text-slate-800'
                                      }`}
                                      title="Toggle Absent (AB)"
                                    >
                                      AB
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openModerationModal(student, sub)}
                                      className="text-amber-600 hover:text-amber-800 font-semibold"
                                      title="Grace / Moderation"
                                    >
                                      ±
                                    </button>
                                  </div>
                                </div>
                              </td>
                            );
                          })}

                        {/* Calculated Summary Cells */}
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-800">
                          {studentSummary?.totalObtainedMarks} / {studentSummary?.totalMaxMarks}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">
                          {studentSummary?.percentage}%
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold font-mono text-[11px]">
                            {studentSummary?.overallGrade}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-black text-slate-900">
                          {studentSummary?.rank ? `#${studentSummary.rank}` : '—'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            studentSummary?.passStatus === 'passed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : studentSummary?.passStatus === 'compartment'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {studentSummary?.passStatus === 'passed'
                              ? 'Pass'
                              : studentSummary?.passStatus === 'compartment'
                              ? 'Compartment'
                              : 'Fail'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Grid Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-slate-600">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">Enter</kbd>
                  <span>Advance Row</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span>Moderated Marks</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span>Absent (AB)</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setFeedbackMessage({ text: 'Draft marks autosaved to local session.', type: 'info' });
                    setTimeout(() => setFeedbackMessage(null), 2500);
                  }}
                >
                  💾 Save Draft
                </Button>
                <Button variant="primary" size="sm" onClick={handlePublishAll}>
                  🚀 Publish Class Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MARKSHEETS & REPORT CARDS */}
      {activeTab === 'marksheets' && (
        <div className="space-y-4">
          <Card className="p-4 bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                Class X-A Generated Marksheets Roster
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Showing all generated marksheets for {examCycles.find(e => e.id === selectedExamId)?.name}.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  window.print();
                }}
              >
                🖨️ Batch Print All (A4 Sheet)
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {computedCohort.map((summary) => (
              <div
                key={summary.studentId}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-[#163A2B] transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block uppercase">
                        Roll #{summary.rollNo} · {summary.admissionNo}
                      </span>
                      <h4 className="font-display font-bold text-base text-slate-900">
                        {summary.studentName}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Rank #{summary.rank || '—'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <span className="text-[9px] uppercase text-slate-500 font-semibold block">Total</span>
                      <span className="font-bold text-slate-800 font-mono text-xs">{summary.totalObtainedMarks} / {summary.totalMaxMarks}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-500 font-semibold block">Percentage</span>
                      <span className="font-bold text-slate-800 font-mono text-xs">{summary.percentage}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-500 font-semibold block">Grade</span>
                      <span className="font-bold text-emerald-800 font-mono text-xs">{summary.overallGrade}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Result Status:</span>
                    <span className="font-semibold text-emerald-700">{summary.passStatus.toUpperCase()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/verify/marksheet/MS-MC-2024-X-${summary.admissionNo.slice(-4)}`}
                    target="_blank"
                    className="text-xs text-slate-600 hover:text-[var(--brand-primary)] font-medium"
                  >
                    Verify Token ↗
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handlePreviewReportCard(summary)}
                  >
                    View Report Card 📄
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXAM CYCLES & GRADING */}
      {activeTab === 'cycles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exam Cycles */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                    Examination Cycles
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">Academic Session 2024–2025</p>
                </div>
                <Button variant="secondary" size="sm">
                  + Add Cycle
                </Button>
              </div>

              <div className="space-y-3">
                {examCycles.map(ex => (
                  <div key={ex.id} className="p-3.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-[var(--text-primary)] block">{ex.name}</span>
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        Code: {ex.code} · Weightage: {ex.weightagePercent}% · {ex.term}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ex.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {ex.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Grading Schemes */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                    Grading Schemes
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">Standardized Evaluation Rules</p>
                </div>
                <Button variant="secondary" size="sm">
                  + Custom Scale
                </Button>
              </div>

              <div className="space-y-3">
                {gradingSchemes.map(gs => (
                  <div key={gs.id} className="p-3.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[var(--text-primary)]">{gs.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        DEFAULT
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)]">{gs.description}</p>
                    <div className="grid grid-cols-4 gap-1 pt-2 border-t border-[var(--border-subtle)] text-[10px]">
                      {gs.rules.map(r => (
                        <div key={r.grade} className="p-1 rounded bg-white text-center border border-slate-200">
                          <span className="font-bold block text-emerald-800">{r.grade}</span>
                          <span className="text-slate-500 text-[9px]">{r.minScore}–{r.maxScore}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 4: MODERATION AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <Card className="p-5 space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              Examination Moderation Audit Trail
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Tamper-evident logs of all grace adjustments, exam cell revisions, and moderation reasons.
            </p>
          </div>

          <table className="w-full text-left text-xs border border-[var(--border-default)]">
            <thead className="bg-[var(--bg-base)] text-[var(--text-secondary)]">
              <tr>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3 text-center">Original</th>
                <th className="py-2.5 px-3 text-center">Moderated</th>
                <th className="py-2.5 px-3">Audit Reason</th>
                <th className="py-2.5 px-3">Adjusted By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {moderationAuditLog.map(log => (
                <tr key={log.id} className="hover:bg-[var(--bg-base)]">
                  <td className="py-2.5 px-3 font-mono text-slate-600">{log.adjustedAt}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-900 block">{log.studentName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{log.admissionNo}</span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{log.subjectName}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-rose-700 line-through">{log.rawMarks}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">{log.moderatedMarks}</td>
                  <td className="py-2.5 px-3 text-slate-700">{log.reason}</td>
                  <td className="py-2.5 px-3 text-slate-600">{log.adjustedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Moderation Drawer / Modal */}
      {moderationTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-base text-slate-900">
                Moderation & Grace Marks Adjustment
              </h3>
              <button
                onClick={() => setModerationTarget(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 text-xs space-y-1">
              <div>
                <span className="text-slate-500">Student: </span>
                <span className="font-bold text-slate-800">{moderationTarget.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500">Subject: </span>
                <span className="font-bold text-slate-800">{moderationTarget.subjectName}</span>
              </div>
              <div>
                <span className="text-slate-500">Original Marks Obtained: </span>
                <span className="font-mono font-bold text-slate-800">{moderationTarget.currentMarks}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Moderated / Revised Marks
              </label>
              <input
                type="number"
                value={moderatedMarksInput}
                onChange={(e) => setModeratedMarksInput(Number(e.target.value))}
                className="w-full text-sm font-mono font-bold p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Audit Reason (Mandatory)
              </label>
              <textarea
                value={moderationReasonInput}
                onChange={(e) => setModerationReasonInput(e.target.value)}
                placeholder="e.g. Grace marks awarded for State Science Olympiad representation; Board evaluation guideline 4.2"
                rows={3}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button variant="secondary" size="sm" onClick={() => setModerationTarget(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveModeration}>
                Apply & Save Audit Log
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Marksheet Full Screen Report Card Modal */}
      {previewSnapshot && (
        <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 flex items-center justify-center print:p-0 print:bg-white">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl relative print:shadow-none print:p-0 print:border-none">
            <div className="flex items-center justify-between pb-4 border-b print:hidden mb-4">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Official Report Card Preview · {previewSnapshot.studentName}
              </h3>
              <button
                onClick={() => setPreviewSnapshot(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
              >
                ✕ Close
              </button>
            </div>

            <MarksheetCardView
              snapshot={previewSnapshot}
              onPrint={() => window.print()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
