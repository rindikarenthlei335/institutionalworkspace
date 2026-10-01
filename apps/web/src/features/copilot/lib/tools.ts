import type { ToolExecutionSummary } from './types';

export interface DataToolContext {
  tenantId: string;
  userId?: string;
  role?: string;
}

// Mock/Sandbox DB data store for demo/tests or tenant execution
const SAMPLE_STUDENTS = [
  { id: 's1', admissionNo: 'ADM-2024-001', name: 'Lalmuanpuia Sailo', class: 'Class 10', section: 'A', gender: 'male', residence: 'day_scholar', feeDue: 0, attendanceRate: 94.2, examPercent: 88.5 },
  { id: 's2', admissionNo: 'ADM-2024-002', name: 'Zoramsangi Ralte', class: 'Class 10', section: 'A', gender: 'female', residence: 'day_scholar', feeDue: 3500, attendanceRate: 71.0, examPercent: 92.0 },
  { id: 's3', admissionNo: 'ADM-2024-003', name: 'Lalthanmawia Pachuau', class: 'Class 9', section: 'B', gender: 'male', residence: 'hosteller', feeDue: 8200, attendanceRate: 68.5, examPercent: 54.0 },
  { id: 's4', admissionNo: 'ADM-2024-004', name: 'Vanlalruati Colney', class: 'Class 9', section: 'A', gender: 'female', residence: 'day_scholar', feeDue: 0, attendanceRate: 98.0, examPercent: 95.4 },
  { id: 's5', admissionNo: 'ADM-2024-005', name: 'Lalremruata Hmar', class: 'Class 8', section: 'A', gender: 'male', residence: 'day_scholar', feeDue: 2100, attendanceRate: 85.0, examPercent: 76.2 }
];

export async function executeDataTool(
  toolName: string,
  args: Record<string, any> = {},
  ctx: DataToolContext
): Promise<ToolExecutionSummary> {
  switch (toolName) {
    case 'student_stats': {
      const total = SAMPLE_STUDENTS.length;
      const male = SAMPLE_STUDENTS.filter((s) => s.gender === 'male').length;
      const female = SAMPLE_STUDENTS.filter((s) => s.gender === 'female').length;
      const hostellers = SAMPLE_STUDENTS.filter((s) => s.residence === 'hosteller').length;
      const dayScholars = total - hostellers;

      return {
        toolName: 'student_stats',
        summary: `Active Enrollment: ${total} students (Male: ${male}, Female: ${female}, Hostellers: ${hostellers}, Day Scholars: ${dayScholars})`,
        data: { total, male, female, hostellers, dayScholars }
      };
    }

    case 'fee_summary': {
      const defaulters = SAMPLE_STUDENTS.filter((s) => s.feeDue > 0);
      const totalDue = defaulters.reduce((acc, s) => acc + s.feeDue, 0);
      const collectedEstimate = 145000;

      return {
        toolName: 'fee_summary',
        summary: `Fee Overview: Total Collected: ₹${collectedEstimate.toLocaleString()}, Outstanding Dues: ₹${totalDue.toLocaleString()} across ${defaulters.length} accounts.`,
        data: { totalDue, collectedEstimate, defaulterCount: defaulters.length }
      };
    }

    case 'list_defaulters': {
      const defaulters = SAMPLE_STUDENTS.filter((s) => s.feeDue > 0).map((s) => ({
        admissionNo: s.admissionNo,
        name: s.name,
        class: s.class,
        feeDue: s.feeDue
      }));

      const summary = defaulters.length > 0
        ? `Found ${defaulters.length} fee defaulters: ${defaulters.map((d) => `${d.name} (${d.class}) - ₹${d.feeDue}`).join(', ')}`
        : 'No fee defaulters found.';

      return {
        toolName: 'list_defaulters',
        summary,
        data: defaulters
      };
    }

    case 'exam_results_summary': {
      const passed = SAMPLE_STUDENTS.filter((s) => s.examPercent >= 40).length;
      const passRate = Math.round((passed / SAMPLE_STUDENTS.length) * 100);
      const avg = Math.round(SAMPLE_STUDENTS.reduce((acc, s) => acc + s.examPercent, 0) / SAMPLE_STUDENTS.length);
      const topPerformer = [...SAMPLE_STUDENTS].sort((a, b) => b.examPercent - a.examPercent)[0];

      return {
        toolName: 'exam_results_summary',
        summary: `Term Exam Results: Pass Rate: ${passRate}%, Batch Average: ${avg}%, Top Rank: ${topPerformer.name} (${topPerformer.examPercent}%).`,
        data: { passRate, average: avg, topPerformer }
      };
    }

    case 'attendance_summary': {
      const lowAttendance = SAMPLE_STUDENTS.filter((s) => s.attendanceRate < 75);
      const avgAttendance = (
        SAMPLE_STUDENTS.reduce((acc, s) => acc + s.attendanceRate, 0) / SAMPLE_STUDENTS.length
      ).toFixed(1);

      return {
        toolName: 'attendance_summary',
        summary: `Attendance Health: Overall Batch Attendance is ${avgAttendance}%. ${lowAttendance.length} students are below the 75% threshold (${lowAttendance.map((s) => s.name).join(', ')}).`,
        data: { averageRate: avgAttendance, flaggedCount: lowAttendance.length, flaggedStudents: lowAttendance }
      };
    }

    case 'search_students': {
      const query = (args.query || '').toLowerCase();
      const results = SAMPLE_STUDENTS.filter(
        (s) => s.name.toLowerCase().includes(query) || s.admissionNo.toLowerCase().includes(query)
      );

      return {
        toolName: 'search_students',
        summary: `Found ${results.length} matching students for "${args.query || ''}".`,
        data: results
      };
    }

    default:
      throw new Error(`Unknown tool name: ${toolName}`);
  }
}
