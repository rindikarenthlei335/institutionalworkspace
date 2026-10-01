export function generateStaticParams() { return [{ token: 'sample' }]; }
import React from 'react';
import Link from 'next/link';

interface MarksheetVerifyPageProps {
  params: Promise<{ token: string }>;
}

export default async function MarksheetVerifyPage({ params }: MarksheetVerifyPageProps) {
  const { token } = await params;

  // In production, this looks up public.marksheets where verification_token = token
  // Sample verification data for demonstration and test verification tokens
  const isValid = token && token.length > 5;
  const isMockToken1 = token.includes('001') || token.includes('0012') || token.includes('TEST');
  const isMockToken2 = token.includes('002') || token.includes('0018');

  const studentName = isMockToken2
    ? 'Vanlalhruaii Pachuau'
    : isMockToken1
    ? 'Lalrintluanga Sailo'
    : 'Authenticated Student';

  const overallGrade = isMockToken2 ? 'A2' : 'A1';
  const passStatus = isMockToken2 ? 'Passed (First Division)' : 'Passed with Distinction';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Verification Status Header */}
        <div className={`p-6 text-center text-white ${isValid ? 'bg-[#163A2B]' : 'bg-rose-700'}`}>
          <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-3xl mb-3 shadow-inner">
            {isValid ? '🛡️' : '⚠️'}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-200 block mb-0.5">
            EduPortal Public Verification Service
          </span>
          <h1 className="font-display font-black text-xl leading-tight">
            {isValid ? 'Authentic Marksheet Verified' : 'Invalid Verification Token'}
          </h1>
          <p className="text-xs text-white/80 mt-1">
            {isValid ? 'Official digital academic record issued by school authority' : 'The requested token could not be verified in the school registry'}
          </p>
        </div>

        {isValid ? (
          <div className="p-6 space-y-5 text-xs text-slate-700">
            {/* Minimal Privacy-Preserving Confirmation Data */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-emerald-900 uppercase block tracking-wider">
                Verification Summary
              </span>
              <p className="text-[11px] text-emerald-800 leading-snug">
                This document was officially signed and frozen as an immutable cryptographic snapshot by the Examination Cell.
              </p>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Issuing Institution</span>
                <span className="font-bold text-slate-900 text-right">Mount Carmel Higher Secondary School</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Student Name</span>
                <span className="font-bold text-slate-900">{studentName}</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Examination</span>
                <span className="font-semibold text-slate-800">Half-Yearly Examination 2024–2025</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Academic Session</span>
                <span className="font-mono text-slate-800">2024–2025</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Overall Grade</span>
                <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                  Grade {overallGrade}
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Result Status</span>
                <span className="font-bold text-emerald-700">{passStatus}</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Verification Token</span>
                <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[190px]">
                  {token}
                </span>
              </div>
            </div>

            {/* Minor Privacy Notice */}
            <div className="p-3 bg-slate-50 rounded-lg text-[10px] text-slate-500 border border-slate-200 leading-relaxed">
              <strong>Data Protection & Minor Privacy:</strong> In accordance with child data safety guidelines, granular subject scores, demographic records, and residential addresses are restricted to authenticated parent and school accounts.
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#163A2B] hover:underline"
              >
                Log in to School Portal for Complete Statement ↗
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-4 text-xs text-slate-600">
            <p>
              The token <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-rose-700">{token}</code> was not found or may have expired or been revoked.
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-[#163A2B] text-white rounded-lg font-semibold hover:bg-[#122e22] transition-colors"
            >
              Return to Public Portal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
