export interface ClassDuesSummary {
  className: string;
  totalStudents: number;
  paidCount: number;
  unpaidCount: number;
  totalDueAmount: number;
  collectionRatePct: number;
}

export interface FeeDefaulterItem {
  studentId: string;
  admissionNo: string;
  studentName: string;
  className: string;
  parentPhone: string;
  dueAmount: number;
  monthsOverdue: number;
  lastReminderSentAt?: string;
}

export interface MonthlyCollectionTrend {
  month: string;
  collected: number;
  target: number;
}

export interface Level2BreakdownDetail {
  title: string;
  items: { label: string; value: string | number; subtext?: string }[];
}

export interface PrincipalMetricsOverview {
  totalStudentsCount: number;
  monthlyFeeCollected: number;
  totalOutstandingDues: number;
  newAdmissionsCount: number;
  monthlyTrends: MonthlyCollectionTrend[];
  classDuesBreakdown: ClassDuesSummary[];
  defaultersList: FeeDefaulterItem[];
}
