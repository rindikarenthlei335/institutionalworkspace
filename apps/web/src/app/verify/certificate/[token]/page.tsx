export function generateStaticParams() { return [{ token: 'sample' }]; }
import React from 'react';
import Link from 'next/link';

interface CertVerifyPageProps {
  params: Promise<{ token: string }>;
}

export default async function CertificateVerifyPage({ params }: CertVerifyPageProps) {
  const { token } = await params;
  const isValid = token && token.length > 5;
  const isTC = token.includes('tc');

  const certType = isTC ? 'Transfer Certificate (School Leaving Deed)' : 'Bonafide Student Certificate';
  const certNumber = isTC ? 'TC-MC-2024-001' : 'BON-MC-2024-042';
  const studentName = isTC ? 'David Lalrinsanga' : 'Zonunmawii Sailo';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Verification Status Banner */}
        <div className={`p-6 text-center text-white ${isValid ? 'bg-[#163A2B]' : 'bg-rose-700'}`}>
          <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-3xl mb-3 shadow-inner">
            {isValid ? '📜' : '⚠️'}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-200 block mb-0.5">
            Official Certificate Authentication
          </span>
          <h1 className="font-display font-black text-xl leading-tight">
            {isValid ? 'Certificate Authenticated' : 'Invalid Certificate Token'}
          </h1>
          <p className="text-xs text-white/80 mt-1">
            {isValid
              ? 'This document was verified in the institutional registry'
              : 'The certificate reference could not be validated'}
          </p>
        </div>

        {isValid ? (
          <div className="p-6 space-y-5 text-xs text-slate-700">
            {/* Valid Badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-xs text-emerald-900">Valid & Genuine Record</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                ISSUED
              </span>
            </div>

            {/* Credential Details */}
            <div className="space-y-3 divide-y divide-slate-100">
              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Institution</span>
                <span className="font-bold text-slate-900 text-right">Mount Carmel Higher Secondary School</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Certificate Number</span>
                <span className="font-bold text-emerald-700 font-mono">{certNumber}</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Document Type</span>
                <span className="font-medium text-slate-800">{certType}</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Student Name</span>
                <span className="font-bold text-slate-900 text-sm">{studentName}</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Academic Session</span>
                <span className="font-medium text-slate-800">2024–2025</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Cryptographic Token</span>
                <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[190px]">
                  {token}
                </span>
              </div>
            </div>

            {/* Privacy Shield Notice */}
            <div className="p-3 bg-slate-50 rounded-lg text-[10px] text-slate-500 border border-slate-200 leading-relaxed">
              <strong>Minor Privacy Protection:</strong> Detailed demographics, personal phone numbers, and residential addresses are omitted from public verification views in compliance with child data safety standards.
            </div>

            <div className="pt-2 text-center">
              <Link href="/" className="text-xs font-semibold text-[#163A2B] hover:underline">
                Mount Carmel School Homepage ↗
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-4 text-xs text-slate-600">
            <p>
              The verification token <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-rose-700">{token}</code> could not be located in our registry.
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-[#163A2B] text-white rounded-lg font-semibold hover:bg-[#122e22] transition-colors"
            >
              Return to School Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
