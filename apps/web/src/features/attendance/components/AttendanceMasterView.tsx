'use client';

import React, { useState } from 'react';
import {
  AttendanceStatus,
  computeClassAttendanceRate,
  computeStudentAttendance
} from '../lib/attendance-computation';

interface RosterStudent {
  id: string;
  rollNo: string;
  name: string;
  admissionNo: string;
  status: AttendanceStatus;
  monthlyHistory: AttendanceStatus[];
}

const SAMPLE_ROSTER: RosterStudent[] = [
  { id: '1', rollNo: '01', name: 'David Lalrinsanga', admissionNo: 'ADM-2024-001', status: 'present', monthlyHistory: ['present', 'present', 'present', 'present', 'late', 'present', 'present'] },
  { id: '2', rollNo: '02', name: 'Lalhmangaiha', admissionNo: 'ADM-2024-002', status: 'present', monthlyHistory: ['present', 'present', 'present', 'present', 'present', 'present', 'present'] },
  { id: '3', rollNo: '03', name: 'R. Vanlalruati', admissionNo: 'ADM-2024-003', status: 'absent', monthlyHistory: ['absent', 'absent', 'present', 'absent', 'present', 'present', 'absent'] },
  { id: '4', rollNo: '04', name: 'C. Lalremruata', admissionNo: 'ADM-2024-004', status: 'late', monthlyHistory: ['present', 'late', 'present', 'present', 'present', 'present', 'present'] },
  { id: '5', rollNo: '05', name: 'Zonunmawii Sailo', admissionNo: 'ADM-2024-005', status: 'present', monthlyHistory: ['present', 'present', 'present', 'present', 'present', 'present', 'present'] },
  { id: '6', rollNo: '06', name: 'Lalthanzuala', admissionNo: 'ADM-2024-006', status: 'excused', monthlyHistory: ['excused', 'present', 'present', 'present', 'present', 'present', 'present'] }
];

export function AttendanceMasterView() {
  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [sessionDate, setSessionDate] = useState('2024-10-01');
  const [roster, setRoster] = useState<RosterStudent[]>(SAMPLE_ROSTER);
  const [activeTab, setActiveTab] = useState<'grid' | 'monthly' | 'alerts'>('grid');

  const handleStatusChange = (id: string, newStatus: AttendanceStatus) => {
    setRoster(prev =>
      prev.map(st => (st.id === id ? { ...st, status: newStatus } : st))
    );
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setRoster(prev => prev.map(st => ({ ...st, status })));
  };

  const classRate = computeClassAttendanceRate(
    roster.map(r => ({ studentId: r.id, studentName: r.name, status: r.status }))
  );

  const presentCount = roster.filter(r => r.status === 'present').length;
  const absentCount = roster.filter(r => r.status === 'absent').length;
  const lateCount = roster.filter(r => r.status === 'late').length;
  const excusedCount = roster.filter(r => r.status === 'excused').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-default)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-display font-bold text-[var(--text-primary)]">
              Daily Attendance & Roster
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Module Active
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Student daily presence tracking with automatic threshold audits and marksheet integration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={sessionDate}
            onChange={e => setSessionDate(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
          />
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
          >
            <option value="Class 10-A">Class 10-A</option>
            <option value="Class 10-B">Class 10-B</option>
            <option value="Class 9-A">Class 9-A</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-default)]">
          <span className="text-[11px] text-[var(--text-muted)] block mb-1">Class Turnout Rate</span>
          <span className="text-xl font-bold text-emerald-500">{classRate}%</span>
        </div>
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-default)]">
          <span className="text-[11px] text-[var(--text-muted)] block mb-1">Present Today</span>
          <span className="text-xl font-bold text-[var(--text-primary)]">{presentCount}</span>
        </div>
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-default)]">
          <span className="text-[11px] text-[var(--text-muted)] block mb-1">Absent</span>
          <span className="text-xl font-bold text-red-500">{absentCount}</span>
        </div>
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-default)]">
          <span className="text-[11px] text-[var(--text-muted)] block mb-1">Late Arrival</span>
          <span className="text-xl font-bold text-amber-500">{lateCount}</span>
        </div>
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-default)]">
          <span className="text-[11px] text-[var(--text-muted)] block mb-1">Excused / Leave</span>
          <span className="text-xl font-bold text-indigo-400">{excusedCount}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-default)] space-x-6 text-sm">
        <button
          onClick={() => setActiveTab('grid')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'grid'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Daily Marking Grid
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'monthly'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Monthly Attendance %
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'alerts'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Low Attendance Warnings (&lt; 75%)
        </button>
      </div>

      {/* Tab 1: Daily Marking Grid */}
      {activeTab === 'grid' && (
        <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-default)]">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              Quick Batch Operations:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMarkAll('present')}
                className="px-2.5 py-1 text-xs rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-semibold"
              >
                Mark All Present
              </button>
              <button
                onClick={() => handleMarkAll('absent')}
                className="px-2.5 py-1 text-xs rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 font-semibold"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--bg-base)] text-[var(--text-secondary)] uppercase font-semibold">
                <tr>
                  <th className="p-3">Roll</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Admission No</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-primary)]">
                {roster.map(student => (
                  <tr key={student.id} className="hover:bg-[var(--bg-base)]/50">
                    <td className="p-3 font-mono font-bold text-[var(--text-muted)]">{student.rollNo}</td>
                    <td className="p-3 font-semibold">{student.name}</td>
                    <td className="p-3 font-mono text-[var(--text-muted)]">{student.admissionNo}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          student.status === 'present'
                            ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                            : student.status === 'absent'
                            ? 'bg-red-500/20 text-red-600 border border-red-500/30'
                            : student.status === 'late'
                            ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-600 border border-indigo-500/30'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex rounded-lg border border-[var(--border-default)] overflow-hidden">
                        {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map(st => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(student.id, st)}
                            className={`px-2.5 py-1 text-[11px] font-bold uppercase ${
                              student.status === st
                                ? st === 'present'
                                  ? 'bg-emerald-600 text-white'
                                  : st === 'absent'
                                  ? 'bg-red-600 text-white'
                                  : st === 'late'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-indigo-600 text-white'
                                : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] text-[var(--text-muted)]'
                            }`}
                          >
                            {st[0].toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Summary */}
      {activeTab === 'monthly' && (
        <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] p-6 space-y-4">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            Cumulative Attendance Record (Feeds into Marksheet)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--bg-base)] text-[var(--text-secondary)] uppercase font-semibold">
                <tr>
                  <th className="p-3">Roll</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Total Sessions</th>
                  <th className="p-3">Present</th>
                  <th className="p-3">Absent</th>
                  <th className="p-3">Late</th>
                  <th className="p-3">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-primary)]">
                {roster.map(st => {
                  const stats = computeStudentAttendance(
                    st.id,
                    st.name,
                    st.monthlyHistory.map(s => ({ status: s }))
                  );
                  return (
                    <tr key={st.id}>
                      <td className="p-3 font-mono font-bold text-[var(--text-muted)]">{st.rollNo}</td>
                      <td className="p-3 font-semibold">{st.name}</td>
                      <td className="p-3">{stats.totalSessions}</td>
                      <td className="p-3 text-emerald-600 font-semibold">{stats.presentCount}</td>
                      <td className="p-3 text-red-500 font-semibold">{stats.absentCount}</td>
                      <td className="p-3 text-amber-500 font-semibold">{stats.lateCount}</td>
                      <td className="p-3">
                        <span
                          className={`font-bold ${
                            stats.isLowAttendance ? 'text-red-500 font-mono' : 'text-emerald-500 font-mono'
                          }`}
                        >
                          {stats.percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Alerts */}
      {activeTab === 'alerts' && (
        <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] p-6 space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <h3 className="text-sm font-bold text-red-600 mb-1">
              Statutory 75% Attendance Requirement
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Under school board guidelines, students with attendance below 75% require formal parent notification prior to final term exam clearance.
            </p>
          </div>

          <div className="space-y-3">
            {roster
              .filter(st => {
                const stats = computeStudentAttendance(
                  st.id,
                  st.name,
                  st.monthlyHistory.map(s => ({ status: s }))
                );
                return stats.isLowAttendance;
              })
              .map(st => {
                const stats = computeStudentAttendance(
                  st.id,
                  st.name,
                  st.monthlyHistory.map(s => ({ status: s }))
                );
                return (
                  <div
                    key={st.id}
                    className="p-4 rounded-xl border border-red-500/30 bg-[var(--bg-base)] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-[var(--text-primary)] block">
                        {st.name} (Roll: {st.rollNo} · {st.admissionNo})
                      </span>
                      <span className="text-[11px] text-red-500 font-semibold">
                        Attendance: {stats.percentage}% ({stats.absentCount} unexcused absences)
                      </span>
                    </div>

                    <button
                      onClick={() => alert(`Sending low attendance alert SMS to guardian of ${st.name}...`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-500"
                    >
                      Send Guardian Alert
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
