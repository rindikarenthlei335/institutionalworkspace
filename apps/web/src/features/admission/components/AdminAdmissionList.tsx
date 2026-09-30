'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { AdmissionApplication } from '../types';
import { ConvertToStudentModal } from './ConvertToStudentModal';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const INITIAL_APPLICATIONS: AdmissionApplication[] = [
  {
    id: 'app1',
    tenantId: 'a1111111-1111-1111-1111-111111111111',
    applicationNo: 'ADM-2025-0042',
    studentName: 'Riya Patel',
    dob: '2012-08-20',
    gender: 'female',
    residenceType: 'hosteller',
    className: 'Class VIII',
    guardianName: 'Karan Patel',
    guardianPhone: '+91 98765 22222',
    guardianEmail: 'karan@example.com',
    status: 'submitted',
    parentConsent: true,
    createdAt: '2024-12-14'
  }
];

export function AdminAdmissionList() {
  const [applications, setApplications] = useState<AdmissionApplication[]>(INITIAL_APPLICATIONS);
  const [convertingApp, setConvertingApp] = useState<AdmissionApplication | null>(null);

  const updateStatus = (id: string, status: AdmissionApplication['status']) => {
    setApplications(applications.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="space-y-4">
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
              <th className="p-3">Application No</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Applying Class</th>
              <th className="p-3">Residence Type</th>
              <th className="p-3">Guardian Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-[var(--bg-elevated)]/50">
                <td className="p-3 font-mono font-semibold text-[var(--brand-primary)]">{app.applicationNo}</td>
                <td className="p-3 font-semibold text-[var(--text-primary)]">{app.studentName}</td>
                <td className="p-3">{app.className}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${app.residenceType === 'hosteller' ? 'bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'}`}>
                    {app.residenceType === 'hosteller' ? 'Hosteller' : 'Day Scholar'}
                  </span>
                </td>
                <td className="p-3 font-mono">{app.guardianPhone}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${app.status === 'enrolled' ? 'bg-[var(--status-success)]/15 text-[var(--status-success)]' : 'bg-[var(--status-warning)]/15 text-[var(--status-warning)]'}`}>
                    {app.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  {app.status !== 'enrolled' && (
                    <button
                      onClick={() => setConvertingApp(app)}
                      className="text-xs font-semibold text-[var(--brand-primary)] hover:underline cursor-pointer"
                    >
                      Approve & Enrol →
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <ConvertToStudentModal
        application={convertingApp}
        isOpen={!!convertingApp}
        onClose={() => setConvertingApp(null)}
        onSuccess={() => {
          if (convertingApp) updateStatus(convertingApp.id, 'enrolled');
        }}
      />
    </div>
  );
}
