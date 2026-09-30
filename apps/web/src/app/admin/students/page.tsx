'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Student } from '@/features/students/types';
import { StudentFormModal } from '@/features/students/components/StudentFormModal';
import { CSVImportModal } from '@/features/students/components/CSVImportModal';
import { Plus, Upload, Download, Pencil, Trash2 } from 'lucide-react';

const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    tenantId: 'a1111111-1111-1111-1111-111111111111',
    admissionNo: 'ADM-2024-0014',
    rollNo: 14,
    fullName: 'Aarav Sharma',
    dob: '2012-05-15',
    gender: 'male',
    residenceType: 'day',
    status: 'active',
    classId: 'c1',
    className: 'Class VIII',
    sectionName: 'A',
    admissionDate: '2024-01-10',
    guardianName: 'Priya Sharma',
    guardianPhone: '+91 98765 11111',
    guardianEmail: 'priya.sharma@example.com',
    createdAt: '2024-01-10'
  },
  {
    id: 's2',
    tenantId: 'a1111111-1111-1111-1111-111111111111',
    admissionNo: 'ADM-2024-0015',
    rollNo: 15,
    fullName: 'Riya Patel',
    dob: '2012-08-20',
    gender: 'female',
    residenceType: 'hosteller',
    status: 'active',
    classId: 'c1',
    className: 'Class VIII',
    sectionName: 'B',
    admissionDate: '2024-01-12',
    guardianName: 'Karan Patel',
    guardianPhone: '+91 98765 22222',
    guardianEmail: 'karan@example.com',
    createdAt: '2024-01-12'
  }
];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleSaveStudent = (data: Student) => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...data } : s));
    } else {
      setStudents([...students, data]);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student record?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Academics</span>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Student Management</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Upload className="w-4 h-4" />} onClick={() => setShowImportModal(true)}>
            Import CSV
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => { setEditingStudent(null); setShowFormModal(true); }}>
            Add Student
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
              <th className="p-3">Admission No</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Class & Section</th>
              <th className="p-3">Residence Type</th>
              <th className="p-3">Guardian Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-[var(--bg-elevated)]/50">
                <td className="p-3 font-mono font-semibold text-[var(--brand-primary)]">{s.admissionNo}</td>
                <td className="p-3 font-semibold text-[var(--text-primary)]">{s.fullName}</td>
                <td className="p-3">{s.className} - {s.sectionName || 'A'}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${s.residenceType === 'hosteller' ? 'bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'}`}>
                    {s.residenceType === 'hosteller' ? 'Hosteller' : 'Day Scholar'}
                  </span>
                </td>
                <td className="p-3 font-mono">{s.guardianPhone}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--status-success)]/15 text-[var(--status-success)]">
                    Active
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => { setEditingStudent(s); setShowFormModal(true); }} className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)]">
                    <Pencil className="w-3.5 h-3.5 inline" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="text-[var(--text-secondary)] hover:text-[var(--status-error)]">
                    <Trash2 className="w-3.5 h-3.5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <StudentFormModal
        isOpen={showFormModal}
        editingStudent={editingStudent}
        onClose={() => setShowFormModal(false)}
        onSave={handleSaveStudent}
      />

      <CSVImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={(count) => alert(`Successfully imported ${count} student records!`)}
      />
    </div>
  );
}
