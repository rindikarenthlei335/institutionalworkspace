'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  DataHubEntityType,
  ImportMode,
  DryRunResult,
  ImportBatchRecord
} from '../types';
import { ENTITY_SCHEMAS } from '../data/schemas';
import {
  generateEntityTemplate,
  downloadExcelBufferInBrowser,
  parseExcelFile,
  autoDetectColumnMapping,
  validateAndDryRun,
  exportDataToCSV
} from '../lib/excel-engine';
import {
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

interface ExcelImportWizardProps {
  initialEntity?: DataHubEntityType;
  existingIdentifiers?: Set<string>;
  existingRecordsMap?: Map<string, Record<string, any>>;
  onImportComplete: (batch: ImportBatchRecord, newRecords: Record<string, any>[]) => void;
  onViewHistory: () => void;
}

export function ExcelImportWizard({
  initialEntity = 'students',
  existingIdentifiers = new Set(),
  existingRecordsMap = new Map(),
  onImportComplete,
  onViewHistory
}: ExcelImportWizardProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Configuration
  const [selectedEntity, setSelectedEntity] = useState<DataHubEntityType>(initialEntity);
  const [templateLang, setTemplateLang] = useState<'en' | 'lus'>('en');
  const [importMode, setImportMode] = useState<ImportMode>('upsert');

  // File parsing state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  // Mapping state
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});

  // Dry-run results
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null);
  const [filterAction, setFilterAction] = useState<'all' | 'create' | 'update' | 'error'>('all');

  // Commit execution
  const [isCommitting, setIsCommitting] = useState(false);
  const [committedBatch, setCommittedBatch] = useState<ImportBatchRecord | null>(null);

  const currentSchema = ENTITY_SCHEMAS[selectedEntity];

  // Download template action
  const handleDownloadTemplate = () => {
    const buffer = generateEntityTemplate(currentSchema, templateLang);
    const fileName = `${selectedEntity}_template_${templateLang}.xlsx`;
    downloadExcelBufferInBrowser(buffer, fileName);
  };

  // Upload handler
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsParsing(true);
    try {
      const { headers, rows } = await parseExcelFile(file);
      setFileHeaders(headers);
      setParsedRows(rows);

      // Auto-detect column mapping
      const mapping = autoDetectColumnMapping(headers, currentSchema);
      setColumnMapping(mapping);

      setCurrentStep(3); // Advance to mapping review
    } catch (err: any) {
      alert(`Error parsing spreadsheet: ${err.message}`);
    } finally {
      setIsParsing(false);
    }
  };

  // Dry Run evaluation
  const handleRunDryRun = () => {
    const res = validateAndDryRun({
      schema: currentSchema,
      rows: parsedRows,
      mapping: columnMapping,
      mode: importMode,
      existingIdentifiers,
      existingRecordsMap
    });
    setDryRunResult(res);
    setCurrentStep(4);
  };

  // Execute Batch
  const handleCommitBatch = () => {
    if (!dryRunResult) return;
    setIsCommitting(true);

    setTimeout(() => {
      const batchNum = `IMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newBatch: ImportBatchRecord = {
        id: `batch-${Date.now()}`,
        batchNumber: batchNum,
        entityType: selectedEntity,
        mode: importMode,
        fileName: uploadedFile?.name || 'spreadsheet.xlsx',
        totalRows: dryRunResult.totalRows,
        createdCount: dryRunResult.toCreate,
        updatedCount: dryRunResult.toUpdate,
        skippedCount: dryRunResult.toSkip,
        errorCount: dryRunResult.errorCount,
        status: 'completed',
        createdBy: 'school_admin',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      const validRecords = dryRunResult.rows
        .filter(r => r.action === 'create' || r.action === 'update')
        .map(r => r.data);

      setCommittedBatch(newBatch);
      setIsCommitting(false);
      setCurrentStep(5);
      onImportComplete(newBatch, validRecords);
    }, 1200);
  };

  const handleExportResultReport = () => {
    if (!dryRunResult || !committedBatch) return;
    const reportData = dryRunResult.rows.map(r => ({
      RowNumber: r.rowNumber,
      Action: r.action.toUpperCase(),
      Identifier: r.uniqueIdentifier,
      Summary: r.summary,
      Status: r.errors ? `ERRORS: ${r.errors.join('; ')}` : 'SUCCESS'
    }));
    exportDataToCSV(reportData, `import_result_${committedBatch.batchNumber}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Wizard Step Progression Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 uppercase">
            Step {currentStep} of 5
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {currentStep === 1 && '1. Select Entity & Download Template'}
            {currentStep === 2 && '2. Upload Spreadsheet (.xlsx / .csv)'}
            {currentStep === 3 && '3. Verify Column Mapping'}
            {currentStep === 4 && '4. Validation & Dry-Run Preview'}
            {currentStep === 5 && '5. Import Complete & Rollback Safeguard'}
          </span>
        </div>

        <button
          onClick={onViewHistory}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          View Import History
        </button>
      </div>

      {/* STEP 1: ENTITY SELECTION & TEMPLATE DOWNLOAD */}
      {currentStep === 1 && (
        <Card className="p-6 space-y-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Choose Data Hub Target & Download Template
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select the entity register you wish to import data into. Download our official pre-formatted Excel template with embedded dropdown lists and rules.
            </p>
          </div>

          {/* Entity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(
              [
                { id: 'students', label: 'Students Master Register', count: 'Class, sections, roll nos, guardians' },
                { id: 'staff', label: 'Staff & Teachers Master', count: 'Qualifications, subjects, website sync' },
                { id: 'guardians', label: 'Guardians & Parents', count: 'Phone login keys, addresses' },
                { id: 'subjects', label: 'Class & Subjects Curriculum', count: 'Max marks, pass marks, electives' },
                { id: 'opening_balances', label: 'Fee Dues & Opening Balances', count: 'Historical fee ledger migration' }
              ] as const
            ).map(item => {
              const isSelected = selectedEntity === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedEntity(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {item.label}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.count}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Template Language & Download Row */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block">
                Official Excel (.xlsx) Template for {currentSchema.titleEn}
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Includes Sheet 1 (Data entry with sample row) and Sheet 2 (Allowed dropdown options & instructions).
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <select
                value={templateLang}
                onChange={e => setTemplateLang(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
              >
                <option value="en">English Headers</option>
                <option value="lus">Mizo (Lushai) Headers</option>
              </select>

              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Template (.xlsx)
              </Button>
            </div>
          </div>

          {/* Import Mode Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Import Reconciliation Mode
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'upsert',
                  title: 'Upsert / Sync (Recommended)',
                  desc: 'Inserts new records and automatically updates existing records matching unique key.'
                },
                {
                  id: 'create_only',
                  title: 'Create Only',
                  desc: 'Inserts new records only. Fails on duplicate unique keys without modifying existing records.'
                },
                {
                  id: 'update_only',
                  title: 'Update Only',
                  desc: 'Updates existing records only. Rejects rows that do not already exist in the database.'
                }
              ].map(mode => (
                <div
                  key={mode.id}
                  onClick={() => setImportMode(mode.id as ImportMode)}
                  className={`p-3.5 rounded-xl border cursor-pointer text-xs ${
                    importMode === mode.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <p className="font-bold text-slate-900 dark:text-white">{mode.title}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{mode.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5"
            >
              Next: Upload Spreadsheet
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: UPLOAD SPREADSHEET */}
      {currentStep === 2 && (
        <Card className="p-8 space-y-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Upload {currentSchema.titleEn} Spreadsheet
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports .xlsx and .csv files. Client-side streaming parser processes 20,000+ rows instantly.
            </p>
          </div>

          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40 max-w-xl mx-auto">
            <FileSpreadsheet className="w-14 h-14 text-blue-600 mb-3" />
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {isParsing ? 'Reading and parsing spreadsheet...' : 'Drop your completed Excel file here'}
            </span>
            <span className="text-xs text-slate-400 mt-1">or click to browse from your computer</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              disabled={isParsing}
              onChange={handleFileSelected}
            />
          </label>

          <div className="flex justify-between max-w-xl mx-auto pt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: VERIFY COLUMN MAPPING */}
      {currentStep === 3 && (
        <Card className="p-6 space-y-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Verify Field Mapping
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                File: <strong>{uploadedFile?.name}</strong> ({parsedRows.length} rows detected)
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              Auto-Matched Columns
            </span>
          </div>

          {/* Mapping Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs overflow-x-auto w-full">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3">Target Field in Database</th>
                  <th className="p-3">Matched Excel Column</th>
                  <th className="p-3">Sample Value from Row 1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {currentSchema.fields.map(field => {
                  const mappedCol = columnMapping[field.key] || '';
                  const sampleVal = mappedCol ? parsedRows[0]?.[mappedCol] : '';

                  return (
                    <tr key={field.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {field.labelEn}
                          </span>
                          {field.required && (
                            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.2 rounded">
                              Required
                            </span>
                          )}
                          {field.uniqueKey && (
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded">
                              Unique Key
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {field.key} • {field.labelLus}
                        </span>
                      </td>

                      <td className="p-3">
                        <select
                          value={mappedCol}
                          onChange={e =>
                            setColumnMapping({ ...columnMapping, [field.key]: e.target.value })
                          }
                          className="w-full max-w-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                        >
                          <option value="">-- Do Not Import / Unmapped --</option>
                          {fileHeaders.map(h => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-3 text-slate-500 font-mono text-[11px] truncate max-w-[200px]">
                        {sampleVal !== undefined && sampleVal !== '' ? String(sampleVal) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              variant="primary"
              onClick={handleRunDryRun}
              className="flex items-center gap-1.5"
            >
              Validate & Preview Dry-Run
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: VALIDATION & DRY-RUN PREVIEW */}
      {currentStep === 4 && dryRunResult && (
        <Card className="p-6 space-y-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Validation & Dry-Run Preview
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulated execution with duplicate detection and field-level diff calculation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter View:</span>
              {(['all', 'create', 'update', 'error'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterAction(tab)}
                  className={`px-2.5 py-1 rounded text-xs capitalize font-semibold transition-colors ${
                    filterAction === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
              <span className="text-[10px] text-slate-500 block uppercase">Total Rows</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {dryRunResult.totalRows}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block uppercase">
                New (To Create)
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                +{dryRunResult.toCreate}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 block uppercase">
                Existing (To Update)
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ~{dryRunResult.toUpdate}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
              <span className="text-[10px] text-rose-600 dark:text-rose-400 block uppercase">
                Errors / Blocked
              </span>
              <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                {dryRunResult.errorCount}
              </span>
            </div>
          </div>

          {/* Rows Diff & Preview List */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs max-h-80 overflow-y-auto overflow-x-auto w-full">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-2.5">Row</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5">Identifier</th>
                  <th className="p-2.5">Record Summary</th>
                  <th className="p-2.5">Validation Details / Diffs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {dryRunResult.rows
                  .filter(r => filterAction === 'all' || r.action === filterAction)
                  .map(row => (
                    <tr
                      key={row.rowNumber}
                      className={row.action === 'error' ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''}
                    >
                      <td className="p-2.5 text-slate-400 font-mono">{row.rowNumber}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.action === 'create'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : row.action === 'update'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {row.action.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold font-mono text-slate-900 dark:text-white">
                        {row.uniqueIdentifier}
                      </td>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300">{row.summary}</td>
                      <td className="p-2.5">
                        {row.errors ? (
                          <div className="space-y-0.5 text-rose-600 dark:text-rose-400 font-medium">
                            {row.errors.map((e, idx) => (
                              <p key={idx}>• {e}</p>
                            ))}
                          </div>
                        ) : row.diff ? (
                          <div className="text-[11px] text-blue-600 dark:text-blue-400 space-y-0.5">
                            {Object.entries(row.diff).map(([k, d]) => (
                              <p key={k}>
                                • {k}: <span className="line-through text-slate-400">{d.oldVal}</span> →{' '}
                                <span className="font-bold">{d.newVal}</span>
                              </p>
                            ))}
                          </div>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            ✓ Ready for insert
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Adjust Mapping
            </Button>

            <Button
              variant="primary"
              disabled={!dryRunResult.isValid || dryRunResult.totalRows === 0}
              onClick={handleCommitBatch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
            >
              Execute Batch Import ({dryRunResult.toCreate + dryRunResult.toUpdate} Records)
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: IMPORT COMPLETE & ROLLBACK SAFEGUARD */}
      {currentStep === 5 && committedBatch && (
        <Card className="p-8 space-y-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Batch Ingested Successfully
            </span>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
              Batch #{committedBatch.batchNumber}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Applied {committedBatch.createdCount} new records and updated {committedBatch.updatedCount}{' '}
              existing records into the {currentSchema.titleEn}.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportResultReport}
              className="flex items-center gap-1.5 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download Result Report (CSV)
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setCurrentStep(1);
                setUploadedFile(null);
                setParsedRows([]);
              }}
              className="text-xs"
            >
              Start Another Import
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
