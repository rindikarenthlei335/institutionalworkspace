'use client';

import React, { useState } from 'react';
import {
  mergeCertificateFields,
  generateCertificateNumber,
  generateCertificateToken,
  CertificateMergeData
} from '../lib/certificate-engine';

interface IssuedCert {
  id: string;
  certNumber: string;
  studentName: string;
  admissionNo: string;
  certType: 'Transfer Certificate' | 'Bonafide Certificate' | 'Character Certificate';
  issueDate: string;
  token: string;
  status: 'issued' | 'approved' | 'draft';
  content: string;
}

const SAMPLE_ISSUED: IssuedCert[] = [
  {
    id: '1',
    certNumber: 'TC-MC-2024-001',
    studentName: 'David Lalrinsanga',
    admissionNo: 'ADM-2024-001',
    certType: 'Transfer Certificate',
    issueDate: '2024-10-01',
    token: 'cert-tc-2024-001-x89',
    status: 'issued',
    content: 'This is to certify that David Lalrinsanga, son of K. Vanlalliana, Admission No: ADM-2024-001, was a student of this institution in Class 10-A. He has paid all school dues and fees up to the current month. Reason for leaving: Parent transfer to Shillong. Conduct and character during the academic session was Exemplary.'
  },
  {
    id: '2',
    certNumber: 'BON-MC-2024-042',
    studentName: 'Zonunmawii Sailo',
    admissionNo: 'ADM-2024-005',
    certType: 'Bonafide Certificate',
    issueDate: '2024-09-15',
    token: 'cert-bon-2024-042-p22',
    status: 'issued',
    content: 'This is to certify that Zonunmawii Sailo, bearing Admission Number ADM-2024-005, is a bonafide student of Class 10-A of Mount Carmel Higher Secondary School, Aizawl for the Academic Session 2024–2025.'
  }
];

export function CertificatesMasterView() {
  const [issuedList, setIssuedList] = useState<IssuedCert[]>(SAMPLE_ISSUED);
  const [selectedCert, setSelectedCert] = useState<IssuedCert | null>(SAMPLE_ISSUED[0]);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const [issueForm, setIssueForm] = useState<{
    studentName: string;
    admissionNo: string;
    className: string;
    fatherName: string;
    certType: 'Transfer Certificate' | 'Bonafide Certificate' | 'Character Certificate';
    leavingReason: string;
    conduct: string;
  }>({
    studentName: 'Lalhmangaiha',
    admissionNo: 'ADM-2024-002',
    className: 'Class 10-A',
    fatherName: 'P.C. Zothansanga',
    certType: 'Transfer Certificate',
    leavingReason: 'Completed Class X Matriculation',
    conduct: 'Very Good'
  });

  const handleIssueCertificate = () => {
    const nextSeq = issuedList.length + 1;
    const prefix = issueForm.certType === 'Transfer Certificate' ? 'TC-MC' : 'BON-MC';
    const certNumber = generateCertificateNumber(prefix, nextSeq);
    const token = generateCertificateToken(certNumber);

    const template =
      issueForm.certType === 'Transfer Certificate'
        ? 'This is to certify that {{student_name}}, son/daughter of {{father_name}}, Admission No: {{admission_no}}, was a student of this institution in {{class}}. He/She has paid all school dues. Reason for leaving: {{leaving_reason}}. Conduct and character was {{conduct}}.'
        : 'This is to certify that {{student_name}}, bearing Admission Number {{admission_no}}, is a bonafide student of {{class}} of {{institution_name}} for the Academic Session {{academic_year}}.';

    const mergeData: CertificateMergeData = {
      student_name: issueForm.studentName,
      admission_no: issueForm.admissionNo,
      class: issueForm.className,
      father_name: issueForm.fatherName,
      leaving_reason: issueForm.leavingReason,
      conduct: issueForm.conduct,
      academic_year: '2024–2025',
      institution_name: 'Mount Carmel Higher Secondary School, Aizawl'
    };

    const rendered = mergeCertificateFields(template, mergeData);

    const newCert: IssuedCert = {
      id: String(Date.now()),
      certNumber,
      studentName: issueForm.studentName,
      admissionNo: issueForm.admissionNo,
      certType: issueForm.certType,
      issueDate: new Date().toISOString().split('T')[0],
      token,
      status: 'issued',
      content: rendered
    };

    setIssuedList(prev => [newCert, ...prev]);
    setSelectedCert(newCert);
    setShowIssueModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-default)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-display font-bold text-[var(--text-primary)]">
              Institutional Certificates & Deeds
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Module Active
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Generate Transfer Certificates (TC), Bonafide Deeds, and Character Certificates with QR verification.
          </p>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-[#163A2B] text-white hover:bg-[#1f4e3b] transition-colors"
        >
          + Issue New Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issued Roster */}
        <div className="lg:col-span-1 bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border-default)] space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Issued Certificates ({issuedList.length})
          </h2>

          <div className="space-y-2">
            {issuedList.map(cert => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedCert?.id === cert.id
                    ? 'border-emerald-500 bg-emerald-500/5 shadow-xs'
                    : 'border-[var(--border-default)] hover:border-slate-400 bg-[var(--bg-base)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    {cert.certNumber}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {cert.status}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[var(--text-primary)]">{cert.studentName}</h3>
                <span className="text-[11px] text-[var(--text-muted)] block">
                  {cert.certType} · {cert.issueDate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Printable Preview */}
        <div className="lg:col-span-2">
          {selectedCert ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-muted)]">Official A4 Layout Preview</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`/verify/certificate/${selectedCert.token}`}
                    target="_blank"
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-slate-400"
                  >
                    🔍 View Public Verification ↗
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#163A2B] text-white hover:bg-[#1f4e3b]"
                  >
                    🖨️ Print Certificate
                  </button>
                </div>
              </div>

              {/* Certificate Sheet (Styled matching official crest) */}
              <div className="bg-white text-slate-900 p-8 rounded-xl border-4 border-double border-[#163A2B] shadow-lg space-y-6">
                {/* Header */}
                <div className="text-center border-b pb-4 border-slate-300">
                  <div className="w-12 h-12 rounded-full bg-[#163A2B] text-[#C9A84C] flex items-center justify-center font-bold text-lg mx-auto mb-2">
                    MC
                  </div>
                  <h1 className="font-serif font-black text-xl text-[#163A2B] tracking-wide uppercase">
                    Mount Carmel Higher Secondary School
                  </h1>
                  <p className="text-[11px] text-slate-600">
                    Mission Veng, Aizawl, Mizoram - 796001 · Affiliated to MBSE (Code: MC-AIZAWL)
                  </p>
                  <div className="inline-block mt-3 px-4 py-1 bg-[#163A2B] text-[#C9A84C] text-xs font-bold uppercase tracking-wider rounded">
                    {selectedCert.certType}
                  </div>
                </div>

                {/* Body Content */}
                <div className="py-4 px-2 space-y-4">
                  <div className="flex justify-between text-xs font-mono text-slate-600">
                    <span>Serial No: <strong>{selectedCert.certNumber}</strong></span>
                    <span>Date of Issue: <strong>{selectedCert.issueDate}</strong></span>
                  </div>

                  <p className="font-serif text-sm leading-relaxed text-slate-800 text-justify indent-8">
                    {selectedCert.content}
                  </p>
                </div>

                {/* Footer Signatures & QR */}
                <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 border border-slate-300 rounded p-1 bg-slate-50 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-mono text-slate-500">QR SEAL</span>
                      <span className="text-xs">🔒</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      <div>Cryptographic Token:</div>
                      <div className="font-mono text-slate-700">{selectedCert.token}</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="font-serif italic font-bold text-sm text-slate-800">
                      C. Lalremruata
                    </div>
                    <div className="w-32 h-0.5 bg-slate-400 my-1 mx-auto" />
                    <div className="text-[10px] uppercase font-bold text-slate-600">
                      Principal / Headmaster
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[var(--text-muted)] border border-dashed rounded-xl">
              Select a certificate to view printable preview
            </div>
          )}
        </div>
      </div>

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] w-full max-w-md rounded-2xl border border-[var(--border-default)] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border-default)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Issue Student Certificate
              </h2>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                  Certificate Type
                </label>
                <select
                  value={issueForm.certType}
                  onChange={e =>
                    setIssueForm(prev => ({ ...prev, certType: e.target.value as any }))
                  }
                  className="w-full p-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                >
                  <option value="Transfer Certificate">Transfer Certificate (TC)</option>
                  <option value="Bonafide Certificate">Bonafide Certificate</option>
                  <option value="Character Certificate">Character Certificate</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={issueForm.studentName}
                  onChange={e => setIssueForm(prev => ({ ...prev, studentName: e.target.value }))}
                  className="w-full p-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                    Admission No
                  </label>
                  <input
                    type="text"
                    value={issueForm.admissionNo}
                    onChange={e => setIssueForm(prev => ({ ...prev, admissionNo: e.target.value }))}
                    className="w-full p-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                    Class
                  </label>
                  <input
                    type="text"
                    value={issueForm.className}
                    onChange={e => setIssueForm(prev => ({ ...prev, className: e.target.value }))}
                    className="w-full p-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                  Father / Guardian Name
                </label>
                <input
                  type="text"
                  value={issueForm.fatherName}
                  onChange={e => setIssueForm(prev => ({ ...prev, fatherName: e.target.value }))}
                  className="w-full p-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                />
              </div>

              {issueForm.certType === 'Transfer Certificate' && (
                <div>
                  <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                    Reason for Leaving School
                  </label>
                  <input
                    type="text"
                    value={issueForm.leavingReason}
                    onChange={e => setIssueForm(prev => ({ ...prev, leavingReason: e.target.value }))}
                    className="w-full p-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[var(--border-default)] flex justify-end gap-3">
              <button
                onClick={() => setShowIssueModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)]"
              >
                Cancel
              </button>
              <button
                onClick={handleIssueCertificate}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#163A2B] text-white hover:bg-[#1f4e3b]"
              >
                Generate & Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
