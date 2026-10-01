import React from 'react';
import { AttendanceMasterView } from '@/features/attendance/components/AttendanceMasterView';

export const metadata = {
  title: 'Attendance Roster | School Admin'
};

export default function AttendancePage() {
  return <AttendanceMasterView />;
}
