import React from 'react';
import { AdminNavLayout } from '@/components/layout/AdminNavLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminNavLayout>{children}</AdminNavLayout>;
}
