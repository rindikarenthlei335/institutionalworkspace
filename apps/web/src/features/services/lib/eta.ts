/**
 * Working-Day ETA & Countdown Engine for Service Store
 * Implements business-day arithmetic skipping weekends and official holidays.
 * Clock starts ONLY when prepayment is confirmed and all required documents are approved.
 */

export const DEFAULT_NATIONAL_HOLIDAYS = [
  '2024-01-26', // Republic Day
  '2024-08-15', // Independence Day
  '2024-10-02', // Gandhi Jayanti
  '2024-12-25', // Christmas Day
  '2025-01-01', // New Year
  '2025-01-26', // Republic Day
  '2025-08-15', // Independence Day
  '2025-10-02', // Gandhi Jayanti
  '2025-12-25', // Christmas Day
  '2026-01-01', // New Year
  '2026-01-26', // Republic Day
  '2026-08-15', // Independence Day
  '2026-10-02', // Gandhi Jayanti
  '2026-12-25'  // Christmas Day
];

/**
 * Checks whether a given Date is a working day (Mon-Fri) and not a national holiday.
 */
export function isWorkingDay(date: Date, holidays: string[] = DEFAULT_NATIONAL_HOLIDAYS): boolean {
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  // Format as YYYY-MM-DD in local time
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  return !holidays.includes(dateStr);
}

/**
 * Adds a specific number of working days to a start date.
 */
export function addWorkingDays(
  startDate: Date,
  workingDays: number,
  holidays: string[] = DEFAULT_NATIONAL_HOLIDAYS
): Date {
  const result = new Date(startDate.getTime());
  let daysAdded = 0;

  while (daysAdded < workingDays) {
    result.setDate(result.getDate() + 1);
    if (isWorkingDay(result, holidays)) {
      daysAdded++;
    }
  }

  return result;
}

/**
 * Counts the remaining working days between current date and target date.
 * If targetDate is in the past, returns a negative count indicating days overdue.
 */
export function countRemainingWorkingDays(
  currentDate: Date,
  targetDate: Date,
  holidays: string[] = DEFAULT_NATIONAL_HOLIDAYS
): number {
  const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const end = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  if (start.getTime() === end.getTime()) {
    return 0;
  }

  if (start > end) {
    // Overdue: count backwards
    let overdueCount = 0;
    const cur = new Date(end.getTime());
    while (cur < start) {
      cur.setDate(cur.getDate() + 1);
      if (isWorkingDay(cur, holidays)) {
        overdueCount--;
      }
    }
    return overdueCount;
  }

  // Future
  let remainingCount = 0;
  const cur = new Date(start.getTime());
  while (cur < end) {
    cur.setDate(cur.getDate() + 1);
    if (isWorkingDay(cur, holidays)) {
      remainingCount++;
    }
  }
  return remainingCount;
}

export interface CalculateETAParams {
  clockStartedAt: string | Date | null | undefined;
  allDocumentsApproved: boolean;
  paymentConfirmed: boolean;
  etaWorkingDays: number;
  holidays?: string[];
  currentDate?: Date;
}

export interface ETAResult {
  clockActive: boolean;
  clockBlockedReason: string | null;
  expectedCompletionDate: Date | null;
  remainingWorkingDays: number | null;
  isDelayed: boolean;
  humanFormattedStatus: string;
}

/**
 * Calculates ETA and countdown status according to project rules:
 * Clock starts only when BOTH payment is confirmed and all required documents are approved.
 */
export function calculateServiceETA({
  clockStartedAt,
  allDocumentsApproved,
  paymentConfirmed,
  etaWorkingDays,
  holidays = DEFAULT_NATIONAL_HOLIDAYS,
  currentDate = new Date()
}: CalculateETAParams): ETAResult {
  // If payment is pending
  if (!paymentConfirmed) {
    return {
      clockActive: false,
      clockBlockedReason: 'Awaiting prepaid payment clearance',
      expectedCompletionDate: null,
      remainingWorkingDays: null,
      isDelayed: false,
      humanFormattedStatus: 'Awaiting Payment'
    };
  }

  // If documents not approved yet
  if (!allDocumentsApproved) {
    return {
      clockActive: false,
      clockBlockedReason: 'Awaiting mandatory document upload and staff verification',
      expectedCompletionDate: null,
      remainingWorkingDays: null,
      isDelayed: false,
      humanFormattedStatus: 'Awaiting Document Approval'
    };
  }

  // Clock is active
  const startTime = clockStartedAt ? new Date(clockStartedAt) : currentDate;
  const expectedDate = addWorkingDays(startTime, etaWorkingDays, holidays);
  const remainingDays = countRemainingWorkingDays(currentDate, expectedDate, holidays);
  const isDelayed = remainingDays < 0;

  let humanFormattedStatus = '';
  if (remainingDays > 1) {
    humanFormattedStatus = `${remainingDays} working days remaining`;
  } else if (remainingDays === 1) {
    humanFormattedStatus = `1 working day remaining (Due tomorrow)`;
  } else if (remainingDays === 0) {
    humanFormattedStatus = `Due today`;
  } else {
    humanFormattedStatus = `Delayed by ${Math.abs(remainingDays)} working day${Math.abs(remainingDays) > 1 ? 's' : ''}`;
  }

  return {
    clockActive: true,
    clockBlockedReason: null,
    expectedCompletionDate: expectedDate,
    remainingWorkingDays: remainingDays,
    isDelayed,
    humanFormattedStatus
  };
}

/**
 * Standard disclaimer appended to all ETA displays as required by specification.
 */
export const SERVICE_STORE_ETA_DISCLAIMER =
  'Durations are estimates and depend on third parties (registries, Google, Apple) and on documents being complete. Rank, approval and review outcomes are not guaranteed.';
