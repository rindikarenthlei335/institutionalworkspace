'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, UploadCloud, CheckCircle2, AlertTriangle, FileArchive, Image as ImageIcon } from 'lucide-react';
import { processPhotoZip, PhotoZipProcessResult } from '../lib/photo-zip-engine';

interface PhotoZipUploaderModalProps {
  entityType: 'students' | 'staff';
  validIdentifiersMap: Map<string, string>; // ID -> Name
  onClose: () => void;
  onApplyPhotos: (matchedCount: number) => void;
}

export function PhotoZipUploaderModal({
  entityType,
  validIdentifiersMap,
  onClose,
  onApplyPhotos
}: PhotoZipUploaderModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PhotoZipProcessResult | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const res = await processPhotoZip(file, validIdentifiersMap);
      setResult(res);
    } catch (err: any) {
      alert(`Error reading ZIP archive: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              Data Hub · Bulk Photo Sync
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Bulk {entityType === 'students' ? 'Student' : 'Staff'} Photo Upload (ZIP)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Instructions */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 space-y-1">
            <span className="font-semibold text-blue-900 dark:text-blue-200 block">
              Filename Matching Rules:
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Name each photo file with the person&apos;s {entityType === 'students' ? 'Admission Number' : 'Employee ID'} (e.g.{' '}
              <code className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 font-mono text-[11px]">
                {entityType === 'students' ? 'ADM-2024-0012.jpg' : 'EMP-MC-001.png'}
              </code>
              ). Pack all images into a standard .zip archive and upload below.
            </p>
          </div>

          {/* Upload Zone */}
          {!result && (
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40">
              <FileArchive className="w-12 h-12 text-blue-500 mb-3" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {isProcessing ? 'Unpacking & Matching Photos...' : 'Drop Photo ZIP Archive Here'}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Supports .zip containing .jpg, .jpeg, .png, or .webp photos
              </span>
              <input
                type="file"
                accept=".zip"
                className="hidden"
                disabled={isProcessing}
                onChange={handleFileUpload}
              />
            </label>
          )}

          {/* Match Results */}
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                  <span className="text-[10px] text-slate-500 block uppercase">Total in Archive</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {result.totalInZip}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block uppercase">Matched to Records</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {result.matchedCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 block uppercase">Unmatched</span>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                    {result.unmatchedCount}
                  </span>
                </div>
              </div>

              {/* Matched Thumbnails Grid */}
              {result.matched.length > 0 && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Matched Photos ({result.matched.length}):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {result.matched.map((m, i) => (
                      <div key={i} className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.dataUrl}
                          alt={m.identifier}
                          className="w-10 h-10 rounded object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{m.identifier}</p>
                          <p className="text-[10px] text-slate-500 truncate">{m.targetRecordName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unmatched list */}
              {result.unmatched.length > 0 && (
                <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 space-y-1">
                  <span className="font-semibold text-amber-900 dark:text-amber-300 block">
                    Unmatched Files ({result.unmatched.length}):
                  </span>
                  <ul className="space-y-1 text-[11px] text-amber-800 dark:text-amber-300/80">
                    {result.unmatched.map((u, i) => (
                      <li key={i}>
                        • <strong>{u.fileName}</strong>: {u.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>

          {result && (
            <Button
              variant="primary"
              size="sm"
              disabled={result.matchedCount === 0}
              onClick={() => onApplyPhotos(result.matchedCount)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Apply {result.matchedCount} Photos to Records
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
