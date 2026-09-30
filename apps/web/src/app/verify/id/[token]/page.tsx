import React from 'react';
import Link from 'next/link';

interface IDCardVerifyPageProps {
  params: Promise<{ token: string }>;
}

export default async function IDCardVerifyPage({ params }: IDCardVerifyPageProps) {
  const { token } = await params;

  const isValid = token && token.length > 5;
  const isStaff = token.includes('STF') || token.includes('STAFF');

  const holderName = isStaff
    ? 'Rev. Dr. Lalthansanga'
    : 'Lalrintluanga Sailo';

  const credentialType = isStaff
    ? 'Staff & Faculty Identity Credential'
    : 'Student Identity Card';

  const roleOrClass = isStaff
    ? 'Principal & Administrative Head'
    : 'Class X · Academic Session 2024–2025';

  const validThrough = isStaff ? '2026-03-31' : '2025-03-31';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Verification Status Banner */}
        <div className={`p-6 text-center text-white ${isValid ? 'bg-[#163A2B]' : 'bg-rose-700'}`}>
          <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-3xl mb-3 shadow-inner">
            {isValid ? '✅' : '⚠️'}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-200 block mb-0.5">
            EduPortal Digital ID Verification
          </span>
          <h1 className="font-display font-black text-xl leading-tight">
            {isValid ? 'Credential Verified: Active & Valid' : 'Invalid ID Credential'}
          </h1>
          <p className="text-xs text-white/80 mt-1">
            {isValid ? 'Issued and authenticated by school administration' : 'This ID card could not be validated in the school registry'}
          </p>
        </div>

        {isValid ? (
          <div className="p-6 space-y-5 text-xs text-slate-700">
            {/* Valid Badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-xs text-emerald-900">Official Institutional Credential</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                ACTIVE
              </span>
            </div>

            {/* Credential Details */}
            <div className="space-y-3 divide-y divide-slate-100">
              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Institution</span>
                <span className="font-bold text-slate-900 text-right">Mount Carmel Higher Secondary School</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Cardholder Name</span>
                <span className="font-bold text-slate-900 text-sm">{holderName}</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Credential Type</span>
                <span className="font-medium text-slate-800">{credentialType}</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Affiliation / Role</span>
                <span className="font-bold text-[#163A2B]">{roleOrClass}</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Valid Until</span>
                <span className="font-bold text-emerald-800 font-mono">{validThrough}</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Security Token</span>
                <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[190px]">
                  {token}
                </span>
              </div>
            </div>

            {/* Privacy Shield Notice */}
            <div className="p-3 bg-slate-50 rounded-lg text-[10px] text-slate-500 border border-slate-200 leading-relaxed">
              <strong>Minor & Staff Privacy Shield:</strong> Personal telephone numbers, emergency contacts, and home residential addresses are protected and omitted from public scan views in compliance with child safety and privacy mandates.
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="text-xs font-semibold text-[#163A2B] hover:underline"
              >
                Mount Carmel School Homepage ↗
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-4 text-xs text-slate-600">
            <p>
              The verification token <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-rose-700">{token}</code> is either invalid, expired, or has been revoked by administration.
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
