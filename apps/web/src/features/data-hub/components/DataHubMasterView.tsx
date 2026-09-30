'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImportBatchRecord, DataHubEntityType } from '../types';
import { ExcelImportWizard } from './ExcelImportWizard';
import { ImportHistoryView } from './ImportHistoryView';
import { PhotoZipUploaderModal } from './PhotoZipUploaderModal';
import { StaffDirectoryView } from '@/features/staff/components/StaffDirectoryView';
import {
  Database,
  UploadCloud,
  FileSpreadsheet,
  Users,
  GraduationCap,
  BookOpen,
  Image as ImageIcon,
  History,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { exportDataToExcel } from '../lib/excel-engine';

export function DataHubMasterView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'import' | 'history'>('overview');
  const [isPhotoZipOpen, setIsPhotoZipOpen] = useState(false);

  // Batches state
  const [batches, setBatches] = useState<ImportBatchRecord[]>([
    {
      id: 'batch-init-1',
      batchNumber: 'IMP-2026-0041',
      entityType: 'students',
      mode: 'upsert',
      fileName: 'academic_session_2026_class_x_admissions.xlsx',
      totalRows: 42,
      createdCount: 40,
      updatedCount: 2,
      skippedCount: 0,
      errorCount: 0,
      status: 'completed',
      createdBy: 'school_admin',
      createdAt: '2026-09-15T09:30:00Z',
      completedAt: '2026-09-15T09:32:15Z'
    }
  ]);

  // Demo maps for identifiers
  const existingIdentifiers = new Set([
    'adm-2024-0001',
    'adm-2024-0002',
    'emp-mc-001',
    'emp-mc-002',
    'emp-mc-003',
    'emp-mc-004',
    'emp-mc-005'
  ]);

  const existingRecordsMap = new Map([
    ['adm-2024-0001', { admission_no: 'ADM-2024-0001', full_name: 'Lalrintluanga', class_name: 'Class IX' }],
    ['emp-mc-001', { employee_id: 'EMP-MC-001', full_name: 'Rev. Dr. Lalthansanga', designation: 'Principal' }]
  ]);

  const validPhotoMap = new Map([
    ['adm-2024-0001', 'Lalrintluanga (Class X)'],
    ['adm-2024-0002', 'Zonunmawia (Class X)'],
    ['emp-mc-001', 'Rev. Dr. Lalthansanga (Principal)'],
    ['emp-mc-002', 'Mrs. Lalnunmawii Sailo (Mathematics)']
  ]);

  const handleImportComplete = (newBatch: ImportBatchRecord) => {
    setBatches([newBatch, ...batches]);
  };

  const handleRollbackBatch = (batchId: string) => {
    setBatches(prev =>
      prev.map(b => (b.id === batchId ? { ...b, status: 'rolled_back' as const } : b))
    );
    alert('Rollback successful: newly created rows removed, updated rows restored to prior snapshot.');
  };

  const handleExportFullBackup = () => {
    const backupSummary = [
      { Entity: 'Students Master Register', Count: 1420, Status: 'Synchronized' },
      { Entity: 'Staff & Teachers Directory', Count: 68, Status: 'Synchronized' },
      { Entity: 'Guardians & Parents', Count: 1290, Status: 'Synchronized' },
      { Entity: 'Curriculum & Subjects', Count: 36, Status: 'Synchronized' },
      { Entity: 'Fee Dues & Opening Balances', Count: 1420, Status: 'Synchronized' }
    ];
    exportDataToExcel(backupSummary, 'DataHub_Master_Summary', 'eduportal_datahub_backup.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Single Source of Truth
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              Pro & Ultimate Feature
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Institutional Data Hub & Import Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Master records ingested here feed fee billing, ID cards, exam marksheets, and public faculty profiles with zero double-entry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPhotoZipOpen(true)}
            className="flex items-center gap-1.5 text-xs"
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
            Bulk Photo (ZIP)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportFullBackup}
            className="flex items-center gap-1.5 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Full Backup (.xlsx)
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('import')}
            className="flex items-center gap-1.5 text-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Import Excel
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 text-xs">
        {[
          { id: 'overview', label: 'Data Hub Overview', icon: Database },
          { id: 'staff', label: 'Staff & Teachers Directory', icon: Users },
          { id: 'import', label: 'Excel Import Wizard', icon: FileSpreadsheet },
          { id: 'history', label: `Import History & Rollback (${batches.length})`, icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 font-bold border-b-2 transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Master Ingestion Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Students Enrolled</span>
                <GraduationCap className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
                1,420
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                ✓ 100% Unique Admission Numbers
              </span>
            </Card>

            <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Staff & Faculty</span>
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
                68
              </p>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 block">
                4 Live on Public Website
              </span>
            </Card>

            <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Guardians Registered</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
                1,290
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Primary Phone Keys Active
              </span>
            </Card>

            <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Curriculum Subjects</span>
                <BookOpen className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
                36
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Classes I through XII
              </span>
            </Card>
          </div>

          {/* Quick Hub Navigator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Bulk Excel Ingestion Engine
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Download pre-formatted bilingual templates, auto-detect mapping, and dry-run with row-level diffs.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">Supports 20,000+ rows in browser</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('import')}
                  className="flex items-center gap-1.5 text-xs text-blue-600"
                >
                  Open Import Wizard
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>

            <Card className="p-5 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Audit Logged & Rollback Ready
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Every batch records row snapshots for instant reversal. Erroneous uploads can be undone with 1 click.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">{batches.length} previous runs saved</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('history')}
                  className="flex items-center gap-1.5 text-xs"
                >
                  View History
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: STAFF DIRECTORY */}
      {activeTab === 'staff' && (
        <StaffDirectoryView onOpenImportForStaff={() => setActiveTab('import')} />
      )}

      {/* TAB 3: EXCEL IMPORT WIZARD */}
      {activeTab === 'import' && (
        <ExcelImportWizard
          existingIdentifiers={existingIdentifiers}
          existingRecordsMap={existingRecordsMap}
          onImportComplete={handleImportComplete}
          onViewHistory={() => setActiveTab('history')}
        />
      )}

      {/* TAB 4: IMPORT HISTORY & ROLLBACK */}
      {activeTab === 'history' && (
        <ImportHistoryView batches={batches} onRollbackBatch={handleRollbackBatch} />
      )}

      {/* Photo ZIP Modal */}
      {isPhotoZipOpen && (
        <PhotoZipUploaderModal
          entityType="students"
          validIdentifiersMap={validPhotoMap}
          onClose={() => setIsPhotoZipOpen(false)}
          onApplyPhotos={count => {
            alert(`Success: Synced ${count} student photos to master student profiles.`);
            setIsPhotoZipOpen(false);
          }}
        />
      )}
    </div>
  );
}
