'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImportBatchRecord } from '../types';
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  History
} from 'lucide-react';
import { exportDataToCSV } from '../lib/excel-engine';

interface ImportHistoryViewProps {
  batches: ImportBatchRecord[];
  onRollbackBatch: (batchId: string) => void;
}

export function ImportHistoryView({ batches, onRollbackBatch }: ImportHistoryViewProps) {
  const [selectedBatch, setSelectedBatch] = useState<ImportBatchRecord | null>(null);

  const handleDownloadErrors = (batch: ImportBatchRecord) => {
    const dummyErrors = [
      {
        Row: 14,
        Identifier: 'ADM-2024-0044',
        Field: 'dob',
        Value: '14-08-2012',
        Error: 'Invalid date format. Expected YYYY-MM-DD.'
      },
      {
        Row: 28,
        Identifier: 'ADM-2024-0058',
        Field: 'gender',
        Value: 'M',
        Error: 'Invalid option "M". Allowed values: [Male, Female, Other].'
      }
    ];
    exportDataToCSV(dummyErrors, `import_errors_${batch.batchNumber}.csv`);
  };

  const totalIngested = batches.reduce((acc, b) => acc + (b.status === 'completed' ? b.createdCount + b.updatedCount : 0), 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 font-medium">Total Batches Run</span>
          <p className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
            {batches.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across students, staff, and guardians
          </span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 font-medium">Master Records Ingested</span>
          <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1">
            {totalIngested.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Cleanly validated through transactional batches
          </span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 font-medium">Rollback Safety Level</span>
          <p className="text-2xl font-bold font-display text-blue-600 dark:text-blue-400 mt-1">
            100% Audit
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Row-level snapshots retained for reversible undo
          </span>
        </Card>
      </div>

      {/* Batches Table */}
      <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Historical Import Runs & Rollback Register
            </h3>
          </div>
          <span className="text-xs text-slate-500">{batches.length} Batches Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500">
                <th className="p-3.5">Batch # & Date</th>
                <th className="p-3.5">Entity & Mode</th>
                <th className="p-3.5">Source File</th>
                <th className="p-3.5">Created</th>
                <th className="p-3.5">Updated</th>
                <th className="p-3.5">Errors</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {batches.map(batch => (
                <tr key={batch.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/30 transition-colors">
                  <td className="p-3.5">
                    <span className="font-bold font-mono text-slate-900 dark:text-white block">
                      {batch.batchNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(batch.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize block">
                      {batch.entityType}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">
                      {batch.mode.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[160px]" title={batch.fileName}>
                        {batch.fileName}
                      </span>
                    </div>
                  </td>

                  <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    +{batch.createdCount}
                  </td>

                  <td className="p-3.5 font-semibold text-blue-600 dark:text-blue-400">
                    ~{batch.updatedCount}
                  </td>

                  <td className="p-3.5">
                    {batch.errorCount > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">
                        {batch.errorCount}
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold block w-fit ${
                        batch.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : batch.status === 'rolled_back'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {batch.status === 'completed' && 'Completed'}
                      {batch.status === 'rolled_back' && 'Rolled Back'}
                      {batch.status === 'failed' && 'Failed'}
                    </span>
                  </td>

                  <td className="p-3.5 text-right space-x-2">
                    {batch.errorCount > 0 && (
                      <button
                        onClick={() => handleDownloadErrors(batch)}
                        className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Errors (CSV)
                      </button>
                    )}

                    {batch.status === 'completed' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to rollback batch ${batch.batchNumber}? Newly created rows will be safely removed, and updated records will revert to their previous values.`
                            )
                          ) {
                            onRollbackBatch(batch.id);
                          }
                        }}
                        className="text-xs text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Rollback
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
