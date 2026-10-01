'use client';

import React, { useState } from 'react';
import { BUILDER_TEMPLATES, CustomEntityTemplate, validateRecordData } from '../lib/builder-engine';

export function CustomBuilderMasterView() {
  const [activeTab, setActiveTab] = useState<'entities' | 'templates' | 'records'>('entities');
  const [selectedEntitySlug, setSelectedEntitySlug] = useState<string>('library');
  const [activeTemplates, setActiveTemplates] = useState<Record<string, CustomEntityTemplate>>({
    library: BUILDER_TEMPLATES.library,
    transport: BUILDER_TEMPLATES.transport,
    events: BUILDER_TEMPLATES.events
  });

  const [records, setRecords] = useState<Record<string, Array<Record<string, any>>>>({
    library: [
      { id: '1', title: 'Mizo Thawnthu Ropui', author: 'B. Lalthangliana', isbn: '978-81-90123-01', genre: 'Mizo Studies', copies: 15 },
      { id: '2', title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', isbn: '978-81-7709-187-7', genre: 'Science', copies: 25 },
      { id: '3', title: 'Aizawl Khaw Chanchin', author: 'C. Lalawmpuia', isbn: '978-81-90123-02', genre: 'History', copies: 8 }
    ],
    transport: [
      { id: '1', route_name: 'Mission Veng - Chanmari Route', vehicle_no: 'MZ-01-A-4421', driver_name: 'Lalmuanpuia', driver_phone: '+91 98623 11111', monthly_fare: 1200 },
      { id: '2', route_name: 'Khatla - Ramhlun North Route', vehicle_no: 'MZ-01-A-8899', driver_name: 'K. Vanlalliana', driver_phone: '+91 98623 22222', monthly_fare: 1400 }
    ],
    events: [
      { id: '1', title: 'Annual Sports Meet 2024', event_date: '2024-11-15', category: 'Sports', venue: 'Lammual Ground' },
      { id: '2', title: 'Science & Robotics Exhibition', event_date: '2024-12-05', category: 'Academic', venue: 'Auditorium' }
    ]
  });

  const [newRecordForm, setNewRecordForm] = useState<Record<string, any>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const currentEntity = activeTemplates[selectedEntitySlug] || BUILDER_TEMPLATES.library;
  const currentRecords = records[selectedEntitySlug] || [];

  const handleInstallTemplate = (templateKey: string) => {
    const tmpl = BUILDER_TEMPLATES[templateKey];
    if (tmpl) {
      setActiveTemplates(prev => ({ ...prev, [templateKey]: tmpl }));
      if (!records[templateKey]) {
        setRecords(prev => ({ ...prev, [templateKey]: [] }));
      }
      setSelectedEntitySlug(templateKey);
      setActiveTab('records');
    }
  };

  const handleSaveRecord = () => {
    const validation = validateRecordData(newRecordForm, currentEntity.fields);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    const newEntry = {
      id: String(Date.now()),
      ...newRecordForm
    };

    setRecords(prev => ({
      ...prev,
      [selectedEntitySlug]: [...(prev[selectedEntitySlug] || []), newEntry]
    }));

    setNewRecordForm({});
    setFormErrors([]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-default)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-display font-bold text-[var(--text-primary)]">
              Custom Module Builder (No-Code)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Ultimate Plan Exclusive
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Design custom database entities, forms, and workflows with automatic JSONB storage & GIN indexing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('templates')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-slate-400 transition-colors"
          >
            📋 Install from Templates ({Object.keys(BUILDER_TEMPLATES).length})
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[var(--border-default)] space-x-6 text-sm">
        <button
          onClick={() => setActiveTab('entities')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'entities'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Active Entities ({Object.keys(activeTemplates).length})
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'records'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Data Records & Table View
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'templates'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Template Gallery
        </button>
      </div>

      {/* Tab 1: Active Entities */}
      {activeTab === 'entities' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.entries(activeTemplates).map(([slug, tmpl]) => (
            <div
              key={slug}
              className="bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border-default)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)]">
                    {tmpl.icon}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-base)] text-[var(--text-muted)]">
                    {tmpl.fields.length} Fields
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{tmpl.name.en}</h3>
                <span className="text-[11px] text-[var(--text-muted)] italic block mb-2">{tmpl.name.lus}</span>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed">
                  {tmpl.description.en}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-default)] flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  {(records[slug] || []).length} Records
                </span>
                <button
                  onClick={() => {
                    setSelectedEntitySlug(slug);
                    setActiveTab('records');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#163A2B] text-white hover:bg-[#1f4e3b]"
                >
                  View Records →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Records & Table View */}
      {activeTab === 'records' && (
        <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentEntity.icon}</span>
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  {currentEntity.name.en}
                </h2>
                <span className="text-xs text-[var(--text-muted)] italic">
                  {currentEntity.name.lus} · {currentRecords.length} entries recorded
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedEntitySlug}
                onChange={e => setSelectedEntitySlug(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
              >
                {Object.entries(activeTemplates).map(([slug, tmpl]) => (
                  <option key={slug} value={slug}>
                    {tmpl.icon} {tmpl.name.en}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setNewRecordForm({});
                  setFormErrors([]);
                  setShowAddModal(true);
                }}
                className="px-3 py-2 text-xs font-bold rounded-lg bg-[#163A2B] text-white hover:bg-[#1f4e3b]"
              >
                + Add Record
              </button>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto rounded-lg border border-[var(--border-default)]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--bg-base)] text-[var(--text-secondary)] uppercase font-semibold">
                <tr>
                  <th className="p-3">#</th>
                  {currentEntity.fields.map(f => (
                    <th key={f.fieldName} className="p-3">
                      {f.fieldLabel.en}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-primary)]">
                {currentRecords.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-[var(--bg-base)]/50">
                    <td className="p-3 font-mono text-[var(--text-muted)]">{idx + 1}</td>
                    {currentEntity.fields.map(f => (
                      <td key={f.fieldName} className="p-3 font-medium">
                        {row[f.fieldName] !== undefined ? String(row[f.fieldName]) : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Template Gallery */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--text-muted)]">
            Pre-built institutional templates crafted for standard K-12 operational workflows. Install with 1-click.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Object.entries(BUILDER_TEMPLATES).map(([key, tmpl]) => {
              const isInstalled = !!activeTemplates[key];
              return (
                <div
                  key={key}
                  className="bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border-default)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)]">
                        {tmpl.icon}
                      </span>
                      {isInstalled && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          INSTALLED
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{tmpl.name.en}</h3>
                    <span className="text-[11px] text-[var(--text-muted)] italic block mb-2">{tmpl.name.lus}</span>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-3 mb-4 leading-relaxed">
                      {tmpl.description.en}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-default)] flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)]">{tmpl.fields.length} Fields Configured</span>
                    <button
                      onClick={() => handleInstallTemplate(key)}
                      disabled={isInstalled}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        isInstalled
                          ? 'bg-slate-200 dark:bg-slate-800 text-[var(--text-muted)] cursor-not-allowed'
                          : 'bg-[#163A2B] text-white hover:bg-[#1f4e3b]'
                      }`}
                    >
                      {isInstalled ? 'Installed' : 'Install Template'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] w-full max-w-lg rounded-2xl border border-[var(--border-default)] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border-default)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Add {currentEntity.name.en} Entry
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
              >
                ✕
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-500 space-y-1">
                {formErrors.map((err, i) => (
                  <div key={i}>• {err}</div>
                ))}
              </div>
            )}

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {currentEntity.fields.map(f => (
                <div key={f.fieldName} className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-primary)] block">
                    {f.fieldLabel.en} {f.isRequired && <span className="text-red-500">*</span>}
                  </label>

                  {f.fieldType === 'select' ? (
                    <select
                      value={newRecordForm[f.fieldName] || ''}
                      onChange={e =>
                        setNewRecordForm(prev => ({ ...prev, [f.fieldName]: e.target.value }))
                      }
                      className="w-full p-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                    >
                      <option value="">Select an option...</option>
                      {f.options?.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : f.fieldType === 'long_text' ? (
                    <textarea
                      rows={3}
                      value={newRecordForm[f.fieldName] || ''}
                      onChange={e =>
                        setNewRecordForm(prev => ({ ...prev, [f.fieldName]: e.target.value }))
                      }
                      className="w-full p-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                    />
                  ) : (
                    <input
                      type={f.fieldType === 'number' || f.fieldType === 'currency' ? 'number' : f.fieldType === 'date' ? 'date' : 'text'}
                      value={newRecordForm[f.fieldName] || ''}
                      onChange={e =>
                        setNewRecordForm(prev => ({
                          ...prev,
                          [f.fieldName]: f.fieldType === 'number' || f.fieldType === 'currency' ? Number(e.target.value) : e.target.value
                        }))
                      }
                      className="w-full p-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[var(--border-default)] flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRecord}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#163A2B] text-white hover:bg-[#1f4e3b]"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
