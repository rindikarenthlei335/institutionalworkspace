import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isWorkingDay,
  addWorkingDays,
  countRemainingWorkingDays,
  calculateServiceETA
} from '../apps/web/src/features/services/lib/eta.ts';

test('isWorkingDay identifies weekends and national holidays', () => {
  // 2026-10-02 is Gandhi Jayanti (Friday)
  const gandhiJayanti = new Date(2026, 9, 2); // Month is 0-indexed, so 9 is Oct
  assert.equal(isWorkingDay(gandhiJayanti, ['2026-10-02']), false);

  // 2026-10-03 is Saturday
  const saturday = new Date(2026, 9, 3);
  assert.equal(isWorkingDay(saturday), false);

  // 2026-10-04 is Sunday
  const sunday = new Date(2026, 9, 4);
  assert.equal(isWorkingDay(sunday), false);

  // 2026-10-05 is Monday (regular working day)
  const monday = new Date(2026, 9, 5);
  assert.equal(isWorkingDay(monday, ['2026-10-02']), true);
});

test('addWorkingDays skips weekends and custom holidays', () => {
  // Start on Friday 2026-10-02 (if it were regular)
  // Let's use Thursday 2026-10-01 as start date
  const start = new Date(2026, 9, 1); // Oct 1, 2026 (Thursday)
  // Adding 3 working days with Oct 2 as holiday:
  // Day 1: Mon Oct 5 (since Fri Oct 2 is holiday, Oct 3-4 weekend)
  // Day 2: Tue Oct 6
  // Day 3: Wed Oct 7
  const result = addWorkingDays(start, 3, ['2026-10-02']);
  assert.equal(result.getFullYear(), 2026);
  assert.equal(result.getMonth(), 9); // Oct
  assert.equal(result.getDate(), 7); // Oct 7
});

test('calculateServiceETA clock does NOT start if payment is pending', () => {
  const result = calculateServiceETA({
    clockStartedAt: null,
    allDocumentsApproved: true,
    paymentConfirmed: false,
    etaWorkingDays: 5
  });

  assert.equal(result.clockActive, false);
  assert.equal(result.clockBlockedReason, 'Awaiting prepaid payment clearance');
  assert.equal(result.expectedCompletionDate, null);
});

test('calculateServiceETA clock does NOT start if documents not approved', () => {
  const result = calculateServiceETA({
    clockStartedAt: null,
    allDocumentsApproved: false,
    paymentConfirmed: true,
    etaWorkingDays: 5
  });

  assert.equal(result.clockActive, false);
  assert.equal(result.clockBlockedReason, 'Awaiting mandatory document upload and staff verification');
  assert.equal(result.expectedCompletionDate, null);
});

test('calculateServiceETA correctly calculates active clock and detects delays', () => {
  // Started on Oct 5 2026 (Monday), 3 working days -> target is Oct 8 2026 (Thursday)
  const startDate = new Date(2026, 9, 5);
  
  // Test when current date is Oct 6 2026 (Tuesday) -> 2 days remaining
  const activeResult = calculateServiceETA({
    clockStartedAt: startDate,
    allDocumentsApproved: true,
    paymentConfirmed: true,
    etaWorkingDays: 3,
    holidays: [],
    currentDate: new Date(2026, 9, 6)
  });

  assert.equal(activeResult.clockActive, true);
  assert.equal(activeResult.isDelayed, false);
  assert.equal(activeResult.remainingWorkingDays, 2);
  assert.match(activeResult.humanFormattedStatus, /2 working days remaining/);

  // Test when current date is Oct 12 2026 (Monday, past due date of Oct 8)
  const delayedResult = calculateServiceETA({
    clockStartedAt: startDate,
    allDocumentsApproved: true,
    paymentConfirmed: true,
    etaWorkingDays: 3,
    holidays: [],
    currentDate: new Date(2026, 9, 12)
  });

  assert.equal(delayedResult.clockActive, true);
  assert.equal(delayedResult.isDelayed, true);
  assert.ok(delayedResult.remainingWorkingDays! < 0);
  assert.match(delayedResult.humanFormattedStatus, /Delayed by/);
});
