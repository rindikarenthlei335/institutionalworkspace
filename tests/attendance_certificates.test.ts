import { describe, it } from 'node:test';
import assert from 'node:assert';

// Pure attendance logic
function computeStudentAttendance(
  entries: Array<{ status: 'present' | 'absent' | 'late' | 'excused' }>,
  threshold: number = 75
) {
  const total = entries.length;
  if (total === 0) return { percentage: 100, isLowAttendance: false };

  let present = 0;
  let absent = 0;
  let late = 0;
  let excused = 0;

  for (const e of entries) {
    if (e.status === 'present') present++;
    else if (e.status === 'absent') absent++;
    else if (e.status === 'late') late++;
    else if (e.status === 'excused') excused++;
  }

  const effective = present + late * 0.5 + excused;
  const percentage = Number(((effective / total) * 100).toFixed(1));

  return {
    total,
    present,
    absent,
    late,
    excused,
    percentage,
    isLowAttendance: percentage < threshold
  };
}

// Pure certificate merge fields logic
function mergeCertificateFields(templateText: string, data: Record<string, string>): string {
  let result = templateText;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

function generateCertificateNumber(prefix: string, seq: number, year: number = 2024): string {
  const padded = String(seq).padStart(3, '0');
  const clean = prefix.endsWith('-') ? prefix : `${prefix}-`;
  return `${clean}${year}-${padded}`;
}

describe('First-Class Installable Modules: Attendance & Certificates (P2-M7)', () => {
  describe('Attendance Computation Engine', () => {
    it('computes accurate attendance percentage with late weighted as half', () => {
      // 10 sessions: 8 present, 1 late, 1 absent => (8 + 0.5) / 10 = 85.0%
      const entries: Array<{ status: 'present' | 'absent' | 'late' | 'excused' }> = [
        { status: 'present' },
        { status: 'present' },
        { status: 'present' },
        { status: 'present' },
        { status: 'present' },
        { status: 'present' },
        { status: 'present' },
        { status: 'present' },
        { status: 'late' },
        { status: 'absent' }
      ];

      const res = computeStudentAttendance(entries);
      assert.strictEqual(res.percentage, 85.0);
      assert.strictEqual(res.isLowAttendance, false);
    });

    it('flags low attendance warning when below statutory 75% threshold', () => {
      // 10 sessions: 6 present, 4 absent => 60.0% (< 75%)
      const entries: Array<{ status: 'present' | 'absent' | 'late' | 'excused' }> = [
        { status: 'present' },
        { status: 'present' },
        { status: 'present' },
        { status: 'present' },
        { status: 'present' },
        { status: 'present' },
        { status: 'absent' },
        { status: 'absent' },
        { status: 'absent' },
        { status: 'absent' }
      ];

      const res = computeStudentAttendance(entries);
      assert.strictEqual(res.percentage, 60.0);
      assert.strictEqual(res.isLowAttendance, true);
    });
  });

  describe('Certificate Merge & Sequencing Engine', () => {
    it('replaces all dynamic placeholders with Data Hub values', () => {
      const template = 'Student {{student_name}} (Adm: {{admission_no}}) in Class {{class}} leaving due to {{reason}}.';
      const data = {
        student_name: 'David Lalrinsanga',
        admission_no: 'ADM-2024-001',
        class: '10-A',
        reason: 'Parent transfer to Shillong'
      };

      const merged = mergeCertificateFields(template, data);
      assert.strictEqual(
        merged,
        'Student David Lalrinsanga (Adm: ADM-2024-001) in Class 10-A leaving due to Parent transfer to Shillong.'
      );
    });

    it('formats sequential serial numbers with padded zeroes', () => {
      assert.strictEqual(generateCertificateNumber('TC-MC', 1, 2024), 'TC-MC-2024-001');
      assert.strictEqual(generateCertificateNumber('TC-MC-', 15, 2024), 'TC-MC-2024-015');
      assert.strictEqual(generateCertificateNumber('BON-MC', 105, 2024), 'BON-MC-2024-105');
    });
  });
});
