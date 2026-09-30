'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdmissionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    gender: 'male',
    residenceType: 'day',
    applyingClass: 'Class I',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    address: '',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <Card className="space-y-4 p-8">
          <div className="w-12 h-12 rounded-full bg-[var(--status-success)]/15 text-[var(--status-success)] font-bold text-2xl flex items-center justify-center mx-auto">
            ✓
          </div>
          <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
            Application Submitted!
          </h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Your admission application number is <strong className="text-[var(--text-primary)] font-mono">ADM-2025-0042</strong>.
            An acknowledgement email has been sent to {formData.guardianEmail}.
          </p>
          <Button variant="secondary" onClick={() => setSubmitted(false)}>
            Submit Another Application
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Online Admissions 2025–26</span>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mt-1">Student Admission Form</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm text-[var(--brand-primary)] border-b border-[var(--border-subtle)] pb-2">
              1. Student Details
            </h3>
            <Input
              label="Student Full Name"
              required
              value={formData.studentName}
              onChange={e => setFormData({ ...formData, studentName: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                type="date"
                required
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Gender</label>
                <select
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)]"
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Applying For Class</label>
                <select
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)]"
                  value={formData.applyingClass}
                  onChange={e => setFormData({ ...formData, applyingClass: e.target.value })}
                >
                  <option value="Class I">Class I</option>
                  <option value="Class V">Class V</option>
                  <option value="Class VIII">Class VIII</option>
                  <option value="Class XI">Class XI</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Residence Type</label>
                <select
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)]"
                  value={formData.residenceType}
                  onChange={e => setFormData({ ...formData, residenceType: e.target.value })}
                >
                  <option value="day">Day Scholar</option>
                  <option value="hosteller">Hosteller</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm text-[var(--brand-primary)] border-b border-[var(--border-subtle)] pb-2">
              2. Guardian Details
            </h3>
            <Input
              label="Guardian Name"
              required
              value={formData.guardianName}
              onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                required
                value={formData.guardianPhone}
                onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                required
                value={formData.guardianEmail}
                onChange={e => setFormData({ ...formData, guardianEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 rounded"
                checked={formData.consent}
                onChange={e => setFormData({ ...formData, consent: e.target.checked })}
              />
              <span className="text-[11px] text-[var(--text-secondary)] leading-tight">
                I confirm the information is accurate and consent to the processing of minor student data under DPDP Act 2023.
              </span>
            </label>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Submit Admission Application & Pay Fee (₹ 500)
          </Button>
        </form>
      </Card>
    </div>
  );
}
