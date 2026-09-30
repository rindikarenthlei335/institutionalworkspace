'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StaffProfile, StaffDepartment } from '../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Globe,
  CheckCircle2,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';
import { exportDataToExcel, exportDataToCSV } from '@/features/data-hub/lib/excel-engine';

interface StaffDirectoryViewProps {
  onOpenImportForStaff?: () => void;
}

export function StaffDirectoryView({ onOpenImportForStaff }: StaffDirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Staff state initialized with realistic staff matching seed data
  const [staffList, setStaffList] = useState<StaffProfile[]>([
    {
      id: 'staff-1',
      tenantId: 't-mount-carmel',
      employeeId: 'EMP-MC-001',
      fullName: 'Rev. Dr. Lalthansanga',
      gender: 'male',
      dob: '1972-04-15',
      designation: 'Principal',
      department: 'Administration',
      employmentType: 'full_time',
      qualification: 'Ph.D. Education, M.Sc. Physics, B.Ed.',
      experienceYears: 24.5,
      joiningDate: '2010-06-01',
      phone: '+91 98621 55667',
      email: 'principal@mountcarmel.edu.in',
      subjectsTaught: ['Physics', 'Moral Science'],
      classesAssigned: ['Class XII-A', 'Class XII-B'],
      showOnWebsite: true,
      websiteBio: 'Over 24 years of educational leadership serving the youth of Mizoram.',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'staff-2',
      tenantId: 't-mount-carmel',
      employeeId: 'EMP-MC-002',
      fullName: 'Mrs. Lalnunmawii Sailo',
      gender: 'female',
      dob: '1985-09-22',
      designation: 'Senior Mathematics Teacher',
      department: 'Mathematics',
      employmentType: 'full_time',
      qualification: 'M.Sc. Mathematics, B.Ed.',
      experienceYears: 14.0,
      joiningDate: '2014-07-15',
      phone: '+91 94361 77889',
      email: 'lalnunmawii.s@mountcarmel.edu.in',
      subjectsTaught: ['Mathematics', 'Higher Mathematics'],
      classesAssigned: ['Class X-A', 'Class XI-A'],
      classTeacherOf: 'Class X-A',
      showOnWebsite: true,
      websiteBio: 'Passionate mathematics educator focused on Olympiad preparation.',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'staff-3',
      tenantId: 't-mount-carmel',
      employeeId: 'EMP-MC-003',
      fullName: 'Mr. C. Lalremruata',
      gender: 'male',
      dob: '1988-11-05',
      designation: 'PGT Chemistry & Science HOD',
      department: 'Science',
      employmentType: 'full_time',
      qualification: 'M.Sc. Chemistry, B.Ed., CSIR-NET',
      experienceYears: 11.5,
      joiningDate: '2017-03-01',
      phone: '+91 98623 11223',
      email: 'remruata.c@mountcarmel.edu.in',
      subjectsTaught: ['Chemistry', 'General Science'],
      classesAssigned: ['Class IX-B', 'Class X-B', 'Class XII-A'],
      classTeacherOf: 'Class XII-A',
      showOnWebsite: true,
      websiteBio: 'Head of Science Department directing hands-on laboratory discovery.',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'staff-4',
      tenantId: 't-mount-carmel',
      employeeId: 'EMP-MC-004',
      fullName: 'Ms. Zothanpuii',
      gender: 'female',
      dob: '1992-02-18',
      designation: 'TGT English & Literature',
      department: 'Humanities',
      employmentType: 'full_time',
      qualification: 'M.A. English Literature, B.Ed.',
      experienceYears: 7.0,
      joiningDate: '2019-06-10',
      phone: '+91 98625 99887',
      email: 'zothanpuii@mountcarmel.edu.in',
      subjectsTaught: ['English', 'English Grammar'],
      classesAssigned: ['Class VIII-A', 'Class IX-A'],
      classTeacherOf: 'Class IX-A',
      showOnWebsite: true,
      websiteBio: 'Editor of the annual Mount Carmel literary school magazine.',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'staff-5',
      tenantId: 't-mount-carmel',
      employeeId: 'EMP-MC-005',
      fullName: 'Mr. Vanlalhruaia',
      gender: 'male',
      dob: '1990-08-30',
      designation: 'Physical Education Director',
      department: 'Sports & Fitness',
      employmentType: 'full_time',
      qualification: 'M.P.Ed., NIS Coach',
      experienceYears: 9.0,
      joiningDate: '2018-05-02',
      phone: '+91 94363 44556',
      email: 'hruaia.sports@mountcarmel.edu.in',
      subjectsTaught: ['Physical Education', 'Athletics'],
      classesAssigned: ['All Classes'],
      showOnWebsite: false,
      websiteBio: 'State athletics coach training interstate football and badminton teams.',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  // Form State for Add Staff
  const [newStaff, setNewStaff] = useState({
    employeeId: '',
    fullName: '',
    designation: '',
    department: 'Teaching' as StaffDepartment,
    qualification: '',
    phone: '',
    email: '',
    subjectsTaught: '',
    showOnWebsite: true
  });

  const toggleWebsiteSync = (staffId: string) => {
    setStaffList(prev =>
      prev.map(s => {
        if (s.id === staffId) {
          const nextVal = !s.showOnWebsite;
          return { ...s, showOnWebsite: nextVal };
        }
        return s;
      })
    );
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.fullName || !newStaff.employeeId) return;

    const profile: StaffProfile = {
      id: `staff-${Date.now()}`,
      tenantId: 't-mount-carmel',
      employeeId: newStaff.employeeId,
      fullName: newStaff.fullName,
      gender: 'male',
      designation: newStaff.designation || 'Teacher',
      department: newStaff.department,
      employmentType: 'full_time',
      qualification: newStaff.qualification,
      experienceYears: 3,
      joiningDate: new Date().toISOString().split('T')[0],
      phone: newStaff.phone || '+91 94361 00000',
      email: newStaff.email || 'teacher@mountcarmel.edu.in',
      subjectsTaught: newStaff.subjectsTaught.split(',').map(s => s.trim()).filter(Boolean),
      classesAssigned: ['Class IX-A'],
      showOnWebsite: newStaff.showOnWebsite,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setStaffList([profile, ...staffList]);
    setIsAddModalOpen(false);
    setNewStaff({
      employeeId: '',
      fullName: '',
      designation: '',
      department: 'Science',
      qualification: '',
      phone: '',
      email: '',
      subjectsTaught: '',
      showOnWebsite: true
    });
  };

  const handleExportExcel = () => {
    const exportRows = staffList.map(s => ({
      EmployeeID: s.employeeId,
      FullName: s.fullName,
      Designation: s.designation,
      Department: s.department,
      Qualification: s.qualification,
      ExperienceYears: s.experienceYears,
      Phone: s.phone,
      Email: s.email,
      SubjectsTaught: s.subjectsTaught.join(', '),
      ClassTeacherOf: s.classTeacherOf || 'N/A',
      PublishedOnWebsite: s.showOnWebsite ? 'Yes' : 'No',
      Status: s.status.toUpperCase()
    }));
    exportDataToExcel(exportRows, 'Staff_Roster', 'school_staff_master.xlsx');
  };

  const handleExportCSV = () => {
    const exportRows = staffList.map(s => ({
      EmployeeID: s.employeeId,
      FullName: s.fullName,
      Designation: s.designation,
      Department: s.department,
      Qualification: s.qualification,
      Phone: s.phone,
      Email: s.email,
      PublishedOnWebsite: s.showOnWebsite ? 'Yes' : 'No'
    }));
    exportDataToCSV(exportRows, 'school_staff_master.csv');
  };

  // Filter
  const filtered = staffList.filter(s => {
    const matchesDept = selectedDept === 'all' || s.department === selectedDept;
    const matchesSearch =
      searchQuery.trim() === '' ||
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Staff & Faculty Master Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Single source of truth for faculty credentials, assignments, and public website synchronization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenImportForStaff && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenImportForStaff}
              className="flex items-center gap-1.5 text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Import Excel
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export (.xlsx)
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Website Sync Note */}
      <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <p className="text-slate-700 dark:text-slate-300">
            <strong>Zero Double-Entry:</strong> Toggling <em>&ldquo;Show on Website&rdquo;</em> automatically synchronizes staff details to your public institution Faculty page and home banner.
          </p>
        </div>
        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 shrink-0">
          {staffList.filter(s => s.showOnWebsite).length} Published
        </span>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
          >
            <option value="all">All Departments</option>
            <option value="Administration">Administration</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Humanities">Humanities</option>
            <option value="Sports & Fitness">Sports & Fitness</option>
          </select>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, employee ID, designation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Staff Master Table */}
      <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500">
                <th className="p-3.5">Employee & Title</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Qualification & Exp.</th>
                <th className="p-3.5">Teaching Scope</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5 text-center">Website Sync</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.map(staff => (
                <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/30 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {staff.fullName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {staff.fullName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {staff.designation} • <span className="font-mono">{staff.employeeId}</span>
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {staff.department}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    <div>{staff.qualification}</div>
                    <span className="text-[11px] text-slate-400">
                      {staff.experienceYears} yrs experience
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      {staff.subjectsTaught.join(', ')}
                    </div>
                    {staff.classTeacherOf && (
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                        Class Teacher: {staff.classTeacherOf}
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-slate-500">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{staff.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[140px]">{staff.email}</span>
                    </div>
                  </td>

                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => toggleWebsiteSync(staff.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors inline-flex items-center gap-1 ${
                        staff.showOnWebsite
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      {staff.showOnWebsite ? 'Live on Web' : 'Hidden'}
                    </button>
                  </td>

                  <td className="p-3.5 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add Faculty / Staff Member
                </h3>
                <p className="text-xs text-slate-500">Creates official staff master record</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EMP-MC-006"
                    value={newStaff.employeeId}
                    onChange={e => setNewStaff({ ...newStaff, employeeId: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Department
                  </label>
                  <select
                    value={newStaff.department}
                    onChange={e => setNewStaff({ ...newStaff, department: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Administration">Administration</option>
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mrs. Mary Ralte"
                  value={newStaff.fullName}
                  onChange={e => setNewStaff({ ...newStaff, fullName: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Teacher"
                    value={newStaff.designation}
                    onChange={e => setNewStaff({ ...newStaff, designation: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. M.A., B.Ed."
                    value={newStaff.qualification}
                    onChange={e => setNewStaff({ ...newStaff, qualification: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 94361 00000"
                    value={newStaff.phone}
                    onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="staff@mountcarmel.edu.in"
                    value={newStaff.email}
                    onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Subjects Taught (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. History, Civics"
                  value={newStaff.subjectsTaught}
                  onChange={e => setNewStaff({ ...newStaff, subjectsTaught: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="webSyncCheck"
                  checked={newStaff.showOnWebsite}
                  onChange={e => setNewStaff({ ...newStaff, showOnWebsite: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="webSyncCheck" className="text-slate-800 dark:text-slate-200 cursor-pointer">
                  <span className="font-bold block">Publish to Public Website Faculty</span>
                  <span className="text-[11px] text-slate-500">
                    Immediately lists this teacher on the public website faculty gallery.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Staff Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
