'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CR80CardPreview } from './CR80CardPreview';
import type { IssuedIDCard, IDCardTemplate, MissingDataAuditItem, CardType } from '../types';

export function IDCardMasterView() {
  const [activeTab, setActiveTab] = useState<'generator' | 'print' | 'templates' | 'reprint'>('generator');
  const [targetType, setTargetType] = useState<CardType>('student');
  const [targetClass, setTargetClass] = useState<string>('Class X-A');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Template State
  const [template, setTemplate] = useState<IDCardTemplate>({
    id: 'tmpl-mc-student',
    name: 'Official Mount Carmel Student ID (CR80)',
    cardType: 'student',
    layout: 'vertical',
    primaryColor: '#163A2B',
    secondaryColor: '#C9A84C',
    backgroundColor: '#FFFFFF',
    showBloodGroup: true,
    showGuardianPhone: true,
    showAddress: true,
    showEmergencyContact: true,
    showBarcode: true,
    showQr: true,
    isDefault: true
  });

  // Sample Issued Cards
  const [cards, setCards] = useState<IssuedIDCard[]>([
    {
      id: 'card-1',
      tenantId: 't-1',
      cardNumber: 'IDC-2024-0012',
      cardType: 'student',
      personId: 'stu-101',
      personName: 'Lalrintluanga Sailo',
      identifier: 'ADM-2024-0012',
      roleOrClass: 'Class X - Section A',
      dob: '2009-05-14',
      bloodGroup: 'B+',
      phone: '+91 98621 11223',
      guardianName: 'C. Lalthansanga',
      address: 'Mission Veng, Aizawl, Mizoram',
      issueDate: '2024-04-01',
      expiryDate: '2025-03-31',
      qrVerificationToken: 'ID-VER-MC-STU-0012-9988',
      status: 'active',
      reprintCount: 0
    },
    {
      id: 'card-2',
      tenantId: 't-1',
      cardNumber: 'IDC-2024-0018',
      cardType: 'student',
      personId: 'stu-102',
      personName: 'Vanlalhruaii Pachuau',
      identifier: 'ADM-2024-0018',
      roleOrClass: 'Class X - Section A',
      dob: '2009-08-20',
      bloodGroup: 'O+',
      phone: '+91 94361 88772',
      guardianName: 'Zonuntluanga Pachuau',
      address: 'Chanmari West, Aizawl, Mizoram',
      issueDate: '2024-04-01',
      expiryDate: '2025-03-31',
      qrVerificationToken: 'ID-VER-MC-STU-0018-2234',
      status: 'active',
      reprintCount: 1,
      lastPrintedAt: '2024-08-12 11:20'
    },
    {
      id: 'card-3',
      tenantId: 't-1',
      cardNumber: 'IDC-2024-0025',
      cardType: 'student',
      personId: 'stu-103',
      personName: 'Zonunmawia Ralte',
      identifier: 'ADM-2024-0025',
      roleOrClass: 'Class X - Section A',
      dob: '2009-02-11',
      bloodGroup: 'A+',
      phone: '+91 98625 44332',
      address: 'Khatla, Aizawl, Mizoram',
      issueDate: '2024-04-01',
      expiryDate: '2025-03-31',
      qrVerificationToken: 'ID-VER-MC-STU-0025-5561',
      status: 'active',
      reprintCount: 0
    },
    {
      id: 'card-4',
      tenantId: 't-1',
      cardNumber: 'IDC-2024-0033',
      cardType: 'student',
      personId: 'stu-104',
      personName: 'C. Lalthanmawii',
      identifier: 'ADM-2024-0033',
      roleOrClass: 'Class X - Section A',
      dob: '2009-11-04',
      bloodGroup: 'AB+',
      phone: '+91 94363 77665',
      address: 'Bawngkawn, Aizawl, Mizoram',
      issueDate: '2024-04-01',
      expiryDate: '2025-03-31',
      qrVerificationToken: 'ID-VER-MC-STU-0033-7789',
      status: 'active',
      reprintCount: 0
    },
    {
      id: 'card-staff-1',
      tenantId: 't-1',
      cardNumber: 'IDC-STAFF-MC-001',
      cardType: 'staff',
      personId: 'staff-1',
      personName: 'Rev. Dr. Lalthansanga',
      identifier: 'EMP-MC-001',
      roleOrClass: 'Principal & Secretary',
      dob: '1972-04-15',
      bloodGroup: 'O+',
      phone: '+91 98621 55667',
      address: 'Principal Bungalow, Mount Carmel Campus, Aizawl',
      issueDate: '2024-04-01',
      expiryDate: '2026-03-31',
      qrVerificationToken: 'ID-VER-MC-STF-0001-4433',
      status: 'active',
      reprintCount: 0
    }
  ]);

  // Missing Data Pre-Generation Detector
  const missingDataReport: MissingDataAuditItem[] = [
    {
      id: 'stu-105',
      name: 'Lalduhawma Fanai',
      identifier: 'ADM-2024-0041',
      type: 'student',
      missingFields: ['Passport Photo', 'Blood Group']
    },
    {
      id: 'stu-106',
      name: 'Malsawmtluanga Hmar',
      identifier: 'ADM-2024-0048',
      type: 'student',
      missingFields: ['Passport Photo']
    }
  ];

  // Selected card for single preview
  const [selectedCardForPreview, setSelectedCardForPreview] = useState<IssuedIDCard>(cards[0]);

  // Reprint modal state
  const [reprintTarget, setReprintTarget] = useState<IssuedIDCard | null>(null);
  const [reprintReason, setReprintReason] = useState<string>('Lost / Misplaced Card');

  // Handle Reprint
  const handleConfirmReprint = () => {
    if (!reprintTarget) return;

    setCards(prev => prev.map(c => {
      if (c.id === reprintTarget.id) {
        return {
          ...c,
          reprintCount: c.reprintCount + 1,
          lastPrintedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return c;
    }));

    setFeedbackMessage(`✓ Reprint recorded for ${reprintTarget.personName}. Reason logged: "${reprintReason}".`);
    setReprintTarget(null);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleGenerateBatch = () => {
    setFeedbackMessage('Issuing sequential ID cards with cryptographically unique QR verification tokens...');
    setTimeout(() => {
      setFeedbackMessage('✓ 42 ID cards successfully generated & synchronized with Data Hub!');
      setTimeout(() => setFeedbackMessage(null), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider">
              Student & Staff Credentials
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 font-bold border border-emerald-300">
              PRO / ULTIMATE
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">
            ID Card Generator & Print Center
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Design CR80 identity cards, detect missing photos, batch print on A4 multi-up sheets, and issue QR-verified digital cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/data-hub"
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
          >
            <span>📷</span>
            <span>Upload Photo ZIP</span>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setActiveTab('print')}>
            <span>🖨️</span>
            <span>Print Center</span>
          </Button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold animate-in fade-in">
          {feedbackMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-default)] gap-2">
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'generator'
              ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>⚡</span>
          <span>Batch Generation Wizard</span>
        </button>
        <button
          onClick={() => setActiveTab('print')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'print'
              ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>🖨️</span>
          <span>Print Center (A4 Multi-Up & Single)</span>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'templates'
              ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>🎨</span>
          <span>Template Customizer</span>
        </button>
        <button
          onClick={() => setActiveTab('reprint')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'reprint'
              ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>📋</span>
          <span>Reprint Tracker & Audit Log</span>
        </button>
      </div>

      {/* TAB 1: BATCH GENERATION WIZARD */}
      {activeTab === 'generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Generation Controls */}
            <Card className="p-5 space-y-4 md:col-span-2">
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Issue Identity Cards Batch
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Card Recipient Group
                  </label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as CardType)}
                    className="w-full text-xs bg-[var(--bg-base)] border border-[var(--border-default)] rounded-lg p-2.5 font-medium"
                  >
                    <option value="student">Students Master Register</option>
                    <option value="staff">Staff & Faculty Register</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    {targetType === 'student' ? 'Class & Section' : 'Department'}
                  </label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full text-xs bg-[var(--bg-base)] border border-[var(--border-default)] rounded-lg p-2.5 font-medium"
                  >
                    {targetType === 'student' ? (
                      <>
                        <option value="Class X-A">Class X - Section A (42 Students)</option>
                        <option value="Class X-B">Class X - Section B (38 Students)</option>
                        <option value="Class XII-A">Class XII - Section A (35 Students)</option>
                      </>
                    ) : (
                      <>
                        <option value="All Departments">All Staff & Faculty (48 Members)</option>
                        <option value="Science">Science Department</option>
                        <option value="Administration">Administrative Staff</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Pre-Generation Audit Report */}
              <div className="pt-2">
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                      <span>⚠️</span>
                      <span>Pre-Generation Audit: {missingDataReport.length} Records Incomplete</span>
                    </span>
                    <Link
                      href="/admin/data-hub"
                      className="text-[11px] font-semibold text-amber-900 underline hover:text-amber-950"
                    >
                      Fix in Data Hub ↗
                    </Link>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    The following students have missing photos or required demographic fields. Cards can still be issued with placeholder avatars, but updating photos is recommended:
                  </p>
                  <div className="divide-y divide-amber-200/60 pt-1 text-xs">
                    {missingDataReport.map((m) => (
                      <div key={m.id} className="py-1.5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-900">{m.name}</span>
                          <span className="text-slate-500 font-mono text-[10px] ml-2">({m.identifier})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {m.missingFields.map(f => (
                            <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold">
                              Missing {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div className="text-xs text-[var(--text-secondary)]">
                  <span>Target Count: </span>
                  <span className="font-bold text-[var(--text-primary)]">42 Cards</span>
                  <span className="mx-2">·</span>
                  <span>Validity: </span>
                  <span className="font-bold text-[var(--text-primary)]">1 Year (2024–2025)</span>
                </div>
                <Button variant="primary" size="sm" onClick={handleGenerateBatch}>
                  ⚡ Generate & Issue 42 Cards
                </Button>
              </div>
            </Card>

            {/* Quick Preview Panel */}
            <Card className="p-5 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">
                Active Card Template Preview
              </span>
              <CR80CardPreview
                card={selectedCardForPreview}
                template={template}
                allowFlip={true}
              />
              <span className="text-[10px] text-slate-500">
                CR80 standard ISO 7810 format (85.60 × 53.98 mm)
              </span>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: PRINT CENTER */}
      {activeTab === 'print' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-default)] print:hidden">
            <div>
              <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                Multi-Up A4 Print Sheet Layout
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Displays 8 cards per A4 page with cutting crop guides, formatted for high-resolution cardstock or PVC sheet printing.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  alert('Exporting high-resolution 300 DPI PDF print bundle with cutting marks...');
                }}
              >
                📥 Download PDF Bundle
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
              >
                🖨️ Print A4 Sheet Now
              </Button>
            </div>
          </div>

          {/* A4 Sheet Container */}
          <div className="bg-slate-200 p-6 rounded-2xl flex justify-center print:bg-white print:p-0 print:m-0">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-300 max-w-5xl w-full min-h-[1050px] print:shadow-none print:border-none print:p-0">
              {/* Sheet Header (print only minimal) */}
              <div className="text-center pb-4 border-b border-dashed border-slate-300 mb-6 print:hidden">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
                  Mount Carmel School · A4 Multi-Up ID Card Sheet (8 Cards / Page)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Sheet ID: SHT-2024-X-01 · Standard 0.5pt Cutting Crop Guides Included
                </span>
              </div>

              {/* 8-Up Grid (2 Columns x 4 Rows) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">
                {cards.map((card) => (
                  <div key={card.id} className="relative p-2 border border-dashed border-slate-300 rounded-2xl">
                    {/* Cutting Crop Marks on Corners */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-slate-400" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-slate-400" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-slate-400" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-slate-400" />

                    <CR80CardPreview
                      card={card}
                      template={template}
                      allowFlip={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TEMPLATE CUSTOMIZER */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-5 space-y-4 lg:col-span-2">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              Customize Identity Card Template
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Card Layout Orientation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTemplate(prev => ({ ...prev, layout: 'vertical' }))}
                    className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                      template.layout === 'vertical'
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                        : 'border-[var(--border-default)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <span className="block font-bold">Standard Vertical CR80</span>
                    <span className="text-[10px] font-normal text-slate-500">Ideal for lanyards and badge holders</span>
                  </button>

                  <button
                    onClick={() => setTemplate(prev => ({ ...prev, layout: 'horizontal' }))}
                    className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                      template.layout === 'horizontal'
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                        : 'border-[var(--border-default)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <span className="block font-bold">Horizontal CR80</span>
                    <span className="text-[10px] font-normal text-slate-500">Standard for faculty & staff clips</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={template.primaryColor}
                      onChange={(e) => setTemplate(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={template.primaryColor}
                      onChange={(e) => setTemplate(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-full text-xs font-mono p-2 border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Accent / Gold Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={template.secondaryColor}
                      onChange={(e) => setTemplate(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={template.secondaryColor}
                      onChange={(e) => setTemplate(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-full text-xs font-mono p-2 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-2 border-t border-[var(--border-subtle)]">
                <span className="text-xs font-bold text-[var(--text-primary)] block">Visible Card Elements</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.showBloodGroup}
                      onChange={(e) => setTemplate(prev => ({ ...prev, showBloodGroup: e.target.checked }))}
                    />
                    <span>Show Blood Group Badge</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.showGuardianPhone}
                      onChange={(e) => setTemplate(prev => ({ ...prev, showGuardianPhone: e.target.checked }))}
                    />
                    <span>Show Guardian Contact</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.showAddress}
                      onChange={(e) => setTemplate(prev => ({ ...prev, showAddress: e.target.checked }))}
                    />
                    <span>Show Residential Address</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.showQr}
                      onChange={(e) => setTemplate(prev => ({ ...prev, showQr: e.target.checked }))}
                    />
                    <span>Include Verification QR Code</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setFeedbackMessage('✓ Template customizations saved as default school preset.');
                    setTimeout(() => setFeedbackMessage(null), 3000);
                  }}
                >
                  Save Preset
                </Button>
              </div>
            </div>
          </Card>

          {/* Live Preview of Customized Template */}
          <Card className="p-5 flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">
              Live Preview
            </span>
            <CR80CardPreview
              card={selectedCardForPreview}
              template={template}
              allowFlip={true}
            />
          </Card>
        </div>
      )}

      {/* TAB 4: REPRINT TRACKER & AUDIT LOG */}
      {activeTab === 'reprint' && (
        <Card className="p-5 space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              ID Card Reprint Tracker & Security Log
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Monitor duplicate printings, card replacements, lost badges, and maintain strict inventory auditing.
            </p>
          </div>

          <table className="w-full text-left text-xs border border-[var(--border-default)]">
            <thead className="bg-[var(--bg-base)] text-[var(--text-secondary)]">
              <tr>
                <th className="py-2.5 px-3">Card Number</th>
                <th className="py-2.5 px-3">Cardholder</th>
                <th className="py-2.5 px-3">Role / Class</th>
                <th className="py-2.5 px-3">Issue Date</th>
                <th className="py-2.5 px-3 text-center">Reprint Count</th>
                <th className="py-2.5 px-3">Last Re-issued</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {cards.map(card => (
                <tr key={card.id} className="hover:bg-[var(--bg-base)]">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{card.cardNumber}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{card.personName}</td>
                  <td className="py-2.5 px-3 text-slate-700">{card.roleOrClass}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{card.issueDate}</td>
                  <td className="py-2.5 px-3 text-center font-mono">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      card.reprintCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {card.reprintCount} {card.reprintCount === 1 ? 'Reprint' : 'Reprints'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                    {card.lastPrintedAt || 'Original Issue'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setReprintTarget(card)}
                    >
                      + Log Reprint
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Reprint Reason Modal */}
      {reprintTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-base text-slate-900">
                Log ID Card Reprint
              </h3>
              <button
                onClick={() => setReprintTarget(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 text-xs space-y-1">
              <div>
                <span className="text-slate-500">Cardholder: </span>
                <span className="font-bold text-slate-800">{reprintTarget.personName}</span>
              </div>
              <div>
                <span className="text-slate-500">Card Number: </span>
                <span className="font-mono font-bold text-slate-800">{reprintTarget.cardNumber}</span>
              </div>
              <div>
                <span className="text-slate-500">Current Reprint Count: </span>
                <span className="font-bold text-amber-700">{reprintTarget.reprintCount}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Reason for Replacement / Reprint
              </label>
              <select
                value={reprintReason}
                onChange={(e) => setReprintReason(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Lost / Misplaced Card">Lost / Misplaced Card</option>
                <option value="Damaged / Broken Card">Damaged / Broken Card</option>
                <option value="Photo / Demographic Detail Update">Photo / Demographic Detail Update</option>
                <option value="Promoted / Class Transfer">Promoted / Class Transfer</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button variant="secondary" size="sm" onClick={() => setReprintTarget(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmReprint}>
                Confirm & Re-issue Card
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
