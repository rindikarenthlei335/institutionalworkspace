'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MarksheetCardView } from '@/features/exams/components/MarksheetCardView';
import type { MarksheetSnapshot } from '@/features/exams/types';

export default function PortalResultsPage() {
  const [selectedExam, setSelectedExam] = useState<string>('half-yearly');
  const [showFullMarksheet, setShowFullMarksheet] = useState<boolean>(false);
  const [withholdResults, setWithholdResults] = useState<boolean>(false);

  // Sample Student Snapshot for Portal
  const studentSnapshot: MarksheetSnapshot = {
    schoolName: 'Mount Carmel Higher Secondary School',
    schoolTagline: 'Excellence in Education & Character',
    schoolAddress: 'Aizawl, Mizoram - 796001',
    schoolPhone: '+91 98621 55667',
    schoolEmail: 'office@mountcarmel.edu.in',
    studentName: 'Lalrintluanga Sailo',
    admissionNo: 'ADM-2024-0012',
    rollNo: 1,
    className: 'Class X',
    section: 'A',
    examName: 'Half-Yearly Examination 2024–2025',
    examCode: 'HALF-YEARLY-2024',
    academicYear: '2024-2025',
    totalMax: 600,
    totalObtained: 565,
    percentage: 94.17,
    overallGrade: 'A1',
    gpa: 9.80,
    rank: 1,
    passStatus: 'Passed with Distinction',
    attendancePercentage: 96.5,
    publishedDate: '2024-09-25',
    verificationToken: 'MS-MC-2024-X-001-A1B9C8D7',
    scholasticSubjects: [
      { code: 'ENG-10', name: 'English Language & Literature', max: 100, pass: 33, obtained: 94, grade: 'A1', gradePoint: 10.0 },
      { code: 'MIZ-10', name: 'Mizo Vernacular Literature', max: 100, pass: 33, obtained: 96, grade: 'A1', gradePoint: 10.0 },
      { code: 'MTH-10', name: 'Mathematics (Standard)', max: 100, pass: 33, obtained: 98, grade: 'A1', gradePoint: 10.0 },
      { code: 'SCI-10', name: 'Integrated Science & Lab', max: 100, pass: 33, obtained: 92, grade: 'A1', gradePoint: 10.0 },
      { code: 'SOC-10', name: 'Social Sciences & Civics', max: 100, pass: 33, obtained: 90, grade: 'A2', gradePoint: 9.0 },
      { code: 'CSC-10', name: 'Computer Applications', max: 100, pass: 33, obtained: 95, grade: 'A1', gradePoint: 10.0 }
    ],
    coScholasticSubjects: [
      { code: 'PED-10', name: 'Physical & Health Education', max: 50, obtained: 48, grade: 'A' }
    ],
    gradingScaleSummary: [
      { grade: 'A1', range: '91% – 100%', gradePoint: 10.0 },
      { grade: 'A2', range: '81% – 90%', gradePoint: 9.0 },
      { grade: 'B1', range: '71% – 80%', gradePoint: 8.0 }
    ]
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            Academic Performance
          </h2>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Official Examination Reports & Marksheets
          </p>
        </div>

        {/* Demo Switcher for Withholding Policy */}
        <button
          onClick={() => setWithholdResults(prev => !prev)}
          className={`text-[9px] px-2 py-1 rounded font-semibold transition-colors ${
            withholdResults
              ? 'bg-rose-100 text-rose-800 border border-rose-300'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          title="Toggle school policy: Withhold results for pending fee defaulters"
        >
          {withholdResults ? 'Defaulter Policy Active' : 'Fee Clear'}
        </button>
      </div>

      {/* Fee Defaulter Withholding Notice */}
      {withholdResults ? (
        <Card className="p-4 bg-amber-50 border-amber-300 text-amber-900 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <h3 className="font-display font-bold text-sm">
              Marksheet Withheld
            </h3>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            In accordance with school administrative policy, examination result statements are temporarily withheld pending fee clearance.
          </p>
          <div className="p-3 bg-white/80 rounded-lg border border-amber-200 text-xs flex justify-between items-center">
            <span>Outstanding Dues:</span>
            <span className="font-mono font-bold text-rose-700">₹ 12,400.00</span>
          </div>
          <Link href="/portal/fees">
            <Button variant="primary" size="sm" className="w-full">
              Clear Pending Fee in Portal ↗
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Exam Selection Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedExam('half-yearly')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedExam === 'half-yearly'
                  ? 'bg-[#163A2B] text-white shadow-xs'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)]'
              }`}
            >
              Half-Yearly 2024–2025
            </button>
            <button
              onClick={() => setSelectedExam('ut1')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedExam === 'ut1'
                  ? 'bg-[#163A2B] text-white shadow-xs'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)]'
              }`}
            >
              Unit Test 1 (July 2024)
            </button>
          </div>

          {/* Performance Summary Card */}
          <Card className="p-4 space-y-3 border-emerald-600/30 bg-emerald-50/20">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                  Term 1 Summary
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {studentSnapshot.examName}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                Rank #{studentSnapshot.rank}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-center">
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-semibold block">Total Marks</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{studentSnapshot.totalObtained} / {studentSnapshot.totalMax}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-semibold block">Percentage</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{studentSnapshot.percentage}%</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-semibold block">Grade</span>
                <span className="font-mono font-bold text-emerald-800 text-xs">{studentSnapshot.overallGrade}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5"
              onClick={() => setShowFullMarksheet(true)}
            >
              <span>📄</span>
              <span>View & Print Official Marksheet</span>
            </Button>
          </Card>

          {/* Granular Subject Marks Breakdown */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
              Subject Scores Breakdown
            </h4>

            <div className="space-y-1.5">
              {studentSnapshot.scholasticSubjects.map((sub) => {
                const pct = (sub.obtained / sub.max) * 100;
                return (
                  <Card key={sub.code} className="p-3 flex items-center justify-between">
                    <div className="flex-1 pr-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-xs text-slate-900">{sub.name}</span>
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {sub.obtained} <span className="text-[10px] text-slate-500 font-normal">/ {sub.max}</span>
                        </span>
                      </div>
                      {/* Performance Bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-8 text-center font-bold font-mono text-xs text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {sub.grade}
                    </span>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Full Screen Report Card Modal */}
      {showFullMarksheet && (
        <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 flex items-center justify-center print:p-0 print:bg-white">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative print:shadow-none print:p-0">
            <div className="flex items-center justify-between pb-3 border-b mb-4 print:hidden">
              <h3 className="font-display font-bold text-sm text-slate-900">
                Official Mark Statement
              </h3>
              <button
                onClick={() => setShowFullMarksheet(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕ Close
              </button>
            </div>

            <MarksheetCardView
              snapshot={studentSnapshot}
              onPrint={() => window.print()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
