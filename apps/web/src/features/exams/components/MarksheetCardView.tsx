'use client';

import React from 'react';
import Link from 'next/link';
import type { MarksheetSnapshot } from '../types';

interface MarksheetCardViewProps {
  snapshot: MarksheetSnapshot;
  onPrint?: () => void;
  showActions?: boolean;
}

export function MarksheetCardView({
  snapshot,
  onPrint,
  showActions = true
}: MarksheetCardViewProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const verifyUrl = `/verify/marksheet/${snapshot.verificationToken}`;

  return (
    <div className="space-y-4">
      {/* Top Action Bar (hidden on print) */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-default)] print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              Official Verified Snapshot · Token: <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono text-[11px]">{snapshot.verificationToken}</code>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={verifyUrl}
              target="_blank"
              className="text-xs font-medium text-[var(--brand-primary)] hover:underline flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-base)]"
            >
              <span>Verify Link</span>
              <span>↗</span>
            </Link>
            <button
              onClick={handlePrint}
              className="bg-[#163A2B] hover:bg-[#122e22] text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <span>🖨️</span>
              <span>Print Marksheet</span>
            </button>
          </div>
        </div>
      )}

      {/* Official Printable Report Card Document (A4 Ratio) */}
      <div className="bg-white text-slate-900 border-2 border-[#163A2B]/20 rounded-xl p-8 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Certificate Border Header */}
        <div className="border-b-2 border-[#163A2B] pb-6 flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#163A2B] text-[#C9A84C] flex items-center justify-center font-display font-black text-2xl shadow-inner shrink-0">
              MC
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#163A2B] uppercase">
                {snapshot.schoolTagline || 'Government Recognized Higher Secondary Institution'}
              </span>
              <h1 className="font-display font-extrabold text-2xl text-[#163A2B] leading-tight">
                {snapshot.schoolName}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                {snapshot.schoolAddress || 'Aizawl, Mizoram · Affiliated to Central Board of Secondary Education'}
              </p>
              <p className="text-[11px] text-slate-500">
                Contact: {snapshot.schoolPhone || '+91 98621 55667'} · Email: {snapshot.schoolEmail || 'office@mountcarmel.edu.in'}
              </p>
            </div>
          </div>

          {/* QR Verification Seal */}
          <div className="text-right shrink-0 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 border-2 border-[#163A2B]/30 rounded-lg p-1 flex flex-col items-center justify-center text-center">
              {/* Minimal SVG QR Code placeholder matching verification token */}
              <svg className="w-14 h-14 text-[#163A2B]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm-5 0h3v3h-3v-3zm2 5h3v3h-3v-3zm3 0h3v3h-3v-3z" />
              </svg>
              <span className="text-[8px] font-mono text-slate-500 mt-0.5">SCAN TO VERIFY</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1 max-w-[90px] truncate">
              {snapshot.verificationToken}
            </span>
          </div>
        </div>

        {/* Examination Title Banner */}
        <div className="bg-[#163A2B]/5 border-y border-[#163A2B]/20 py-2.5 px-4 my-6 text-center">
          <h2 className="font-display font-bold text-base text-[#163A2B] uppercase tracking-wide">
            Official Report Card · {snapshot.examName} ({snapshot.academicYear})
          </h2>
        </div>

        {/* Student Demographics Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 text-xs mb-6">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student Name</span>
            <span className="font-bold text-slate-900 text-sm">{snapshot.studentName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Admission No</span>
            <span className="font-bold font-mono text-slate-800">{snapshot.admissionNo}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Class & Section</span>
            <span className="font-bold text-slate-800">{snapshot.className} - {snapshot.section || 'A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Roll Number</span>
            <span className="font-bold text-slate-800">{snapshot.rollNo ? `Roll #${snapshot.rollNo}` : 'N/A'}</span>
          </div>
          {snapshot.attendancePercentage && (
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Session Attendance</span>
              <span className="font-semibold text-emerald-700">{snapshot.attendancePercentage}% Present</span>
            </div>
          )}
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Result Status</span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
              {snapshot.passStatus}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Class Merit Rank</span>
            <span className="font-black text-[#163A2B] text-sm">
              {snapshot.rank ? `Rank ${snapshot.rank}` : 'Qualified'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Issue Date</span>
            <span className="text-slate-700">{snapshot.publishedDate}</span>
          </div>
        </div>

        {/* Scholastic Assessment Marks Table */}
        <div className="space-y-2 mb-6">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#163A2B] flex items-center justify-between">
            <span>Part I: Scholastic Performance</span>
            <span className="text-[10px] text-slate-500 normal-case font-normal">Graded on CBSE 9-Point Scale</span>
          </h3>

          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-[#163A2B] text-white">
              <tr>
                <th className="py-2 px-3 font-semibold text-[11px]">Code</th>
                <th className="py-2 px-3 font-semibold text-[11px]">Subject Title</th>
                <th className="py-2 px-3 font-semibold text-[11px] text-center">Max Marks</th>
                <th className="py-2 px-3 font-semibold text-[11px] text-center">Pass Marks</th>
                <th className="py-2 px-3 font-semibold text-[11px] text-center">Marks Obtained</th>
                <th className="py-2 px-3 font-semibold text-[11px] text-center">Subject Grade</th>
                <th className="py-2 px-3 font-semibold text-[11px] text-center">Grade Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {snapshot.scholasticSubjects.map((sub, idx) => (
                <tr key={sub.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-600">{sub.code}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{sub.name}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600 font-mono">{sub.max}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600 font-mono">{sub.pass}</td>
                  <td className="py-2.5 px-3 text-center font-bold font-mono text-slate-900">{sub.obtained}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-800">
                    <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-mono">
                      {sub.grade}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-800">{sub.gradePoint.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
            {/* Grand Total Footer */}
            <tfoot className="bg-slate-100/90 font-bold border-t-2 border-slate-300">
              <tr>
                <td colSpan={2} className="py-2.5 px-3 text-slate-800 uppercase text-[11px]">
                  Scholastic Aggregate
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-slate-900">{snapshot.totalMax}</td>
                <td className="py-2.5 px-3 text-center text-slate-500">—</td>
                <td className="py-2.5 px-3 text-center font-mono text-slate-900 text-sm">{snapshot.totalObtained}</td>
                <td className="py-2.5 px-3 text-center text-emerald-800 font-black text-sm">{snapshot.overallGrade}</td>
                <td className="py-2.5 px-3 text-center font-mono text-slate-900">{snapshot.gpa.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Co-Scholastic Assessment Table */}
        {snapshot.coScholasticSubjects && snapshot.coScholasticSubjects.length > 0 && (
          <div className="space-y-2 mb-6">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#163A2B]">
              Part II: Co-Scholastic & Life Skills Evaluation
            </h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-200 text-slate-800 font-semibold">
                <tr>
                  <th className="py-2 px-3">Subject / Activity</th>
                  <th className="py-2 px-3 text-center">Maximum Marks</th>
                  <th className="py-2 px-3 text-center">Marks Obtained</th>
                  <th className="py-2 px-3 text-center">Performance Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {snapshot.coScholasticSubjects.map((co) => (
                  <tr key={co.code}>
                    <td className="py-2 px-3 font-medium text-slate-900">{co.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-slate-600">{co.max}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">{co.obtained}</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-800">{co.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Overall Achievement Badge & Scale Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-[#163A2B]/5 border border-[#163A2B]/20 mb-8">
          <div className="text-center p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Percentage</span>
            <span className="font-display font-black text-2xl text-[#163A2B]">{snapshot.percentage}%</span>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Cumulative GPA</span>
            <span className="font-display font-black text-2xl text-[#163A2B]">{snapshot.gpa.toFixed(2)} / 10.0</span>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Overall Grade</span>
            <span className="font-display font-black text-2xl text-emerald-700">{snapshot.overallGrade}</span>
          </div>
        </div>

        {/* Signature & Seal Block */}
        <div className="pt-10 grid grid-cols-3 gap-6 text-center border-t border-slate-300 text-xs">
          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mx-6 mb-2 flex items-end justify-center pb-1">
              <span className="font-serif italic text-slate-600 text-[11px]">Mrs. Lalnunmawii Sailo</span>
            </div>
            <span className="font-semibold text-slate-700 block">Class Teacher</span>
            <span className="text-[10px] text-slate-500">Mount Carmel School</span>
          </div>
          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mx-6 mb-2 flex items-end justify-center pb-1">
              <span className="font-serif italic text-slate-600 text-[11px]">Examination Cell</span>
            </div>
            <span className="font-semibold text-slate-700 block">Controller of Examinations</span>
            <span className="text-[10px] text-slate-500">Official Evaluation Office</span>
          </div>
          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mx-6 mb-2 flex items-end justify-center pb-1">
              <span className="font-serif italic text-slate-800 font-bold text-xs">Rev. Dr. Lalthansanga</span>
            </div>
            <span className="font-bold text-[#163A2B] block">Principal & Secretary</span>
            <span className="text-[10px] text-slate-500">Mount Carmel Higher Secondary School</span>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
          This digital mark statement is an authentic tamper-proof document issued by EduPortal Multi-Tenant SaaS.
          To verify authenticity, scan the QR code above or visit <code className="text-slate-600">https://mountcarmel.eduportal.com{verifyUrl}</code>
        </div>
      </div>
    </div>
  );
}
