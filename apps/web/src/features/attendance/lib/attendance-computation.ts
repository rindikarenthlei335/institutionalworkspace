export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceEntry {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface StudentAttendanceSummary {
  studentId: string;
  studentName: string;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  percentage: number;
  isLowAttendance: boolean; // < 75% threshold
}

export function computeStudentAttendance(
  studentId: string,
  studentName: string,
  entries: Array<{ status: AttendanceStatus }>,
  thresholdPercentage: number = 75
): StudentAttendanceSummary {
  const total = entries.length;
  if (total === 0) {
    return {
      studentId,
      studentName,
      totalSessions: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      excusedCount: 0,
      percentage: 100,
      isLowAttendance: false
    };
  }

  let present = 0;
  let absent = 0;
  let late = 0;
  let excused = 0;

  for (const entry of entries) {
    if (entry.status === 'present') present++;
    else if (entry.status === 'absent') absent++;
    else if (entry.status === 'late') late++;
    else if (entry.status === 'excused') excused++;
  }

  // Late counts as 0.5 attendance, excused counts as full attendance
  const effectivePresent = present + late * 0.5 + excused;
  const percentage = Number(((effectivePresent / total) * 100).toFixed(1));

  return {
    studentId,
    studentName,
    totalSessions: total,
    presentCount: present,
    absentCount: absent,
    lateCount: late,
    excusedCount: excused,
    percentage,
    isLowAttendance: percentage < thresholdPercentage
  };
}

export function computeClassAttendanceRate(entries: AttendanceEntry[]): number {
  if (entries.length === 0) return 100;
  const presentLike = entries.filter(e => e.status === 'present' || e.status === 'excused').length;
  const halfLate = entries.filter(e => e.status === 'late').length * 0.5;
  return Number((((presentLike + halfLate) / entries.length) * 100).toFixed(1));
}
