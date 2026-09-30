import test from 'node:test';
import assert from 'node:assert/strict';

export interface LateFeeRule {
  gracePeriodDays: number;
  type: 'flat' | 'daily';
  rateINR: number;
  maxLateFeeINR?: number;
}

export function calculateLateFee(
  dueDate: string,
  paymentDate: string,
  rule: LateFeeRule
): number {
  const due = new Date(dueDate).getTime();
  const payment = new Date(paymentDate).getTime();
  const diffDays = Math.floor((payment - due) / (1000 * 60 * 60 * 24));

  if (diffDays <= rule.gracePeriodDays) {
    return 0; // Within grace period
  }

  const overdueDays = diffDays - rule.gracePeriodDays;

  let fee = 0;
  if (rule.type === 'flat') {
    fee = rule.rateINR;
  } else {
    fee = overdueDays * rule.rateINR;
  }

  if (rule.maxLateFeeINR !== undefined) {
    fee = Math.min(fee, rule.maxLateFeeINR);
  }

  return fee;
}

test('Late Fee: Grace period prevents penalty', () => {
  const rule: LateFeeRule = {
    gracePeriodDays: 5,
    type: 'flat',
    rateINR: 200
  };

  // Paid 3 days late (within 5-day grace period)
  const fee = calculateLateFee('2025-04-10', '2025-04-13', rule);
  assert.equal(fee, 0);
});

test('Late Fee: Daily slab calculation with maximum cap', () => {
  const rule: LateFeeRule = {
    gracePeriodDays: 3,
    type: 'daily',
    rateINR: 50,
    maxLateFeeINR: 500
  };

  // Paid 10 days after due date: 7 overdue days beyond grace period * 50 = ₹350
  const fee = calculateLateFee('2025-04-10', '2025-04-20', rule);
  assert.equal(fee, 350);

  // Paid 25 days after due date: 22 overdue days * 50 = 1100 -> capped at max 500
  const cappedFee = calculateLateFee('2025-04-10', '2025-05-05', rule);
  assert.equal(cappedFee, 500);
});
