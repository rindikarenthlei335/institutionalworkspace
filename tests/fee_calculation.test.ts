import test from 'node:test';
import assert from 'node:assert/strict';

export interface FeeHeadItem {
  id: string;
  name: string;
  amountPaise: number;
  residenceType: 'all' | 'day' | 'hosteller';
}

export function calculateStudentFees(
  feeHeads: FeeHeadItem[],
  studentResidence: 'day' | 'hosteller',
  concession?: { type: 'flat' | 'percentage'; value: number }
) {
  const applicableHeads = feeHeads.filter(
    (h) => h.residenceType === 'all' || h.residenceType === studentResidence
  );

  const subtotalPaise = applicableHeads.reduce((acc, h) => acc + h.amountPaise, 0);

  let discountPaise = 0;
  if (concession) {
    if (concession.type === 'flat') {
      discountPaise = Math.min(concession.value * 100, subtotalPaise);
    } else {
      discountPaise = Math.round((subtotalPaise * concession.value) / 100);
    }
  }

  const netPaise = Math.max(0, subtotalPaise - discountPaise);

  return {
    subtotalINR: subtotalPaise / 100,
    discountINR: discountPaise / 100,
    netINR: netPaise / 100,
    applicableHeadCount: applicableHeads.length
  };
}

test('Fee Calculation: Day Scholar vs Hosteller fee differentiation', () => {
  const standardFeeHeads: FeeHeadItem[] = [
    { id: '1', name: 'Tuition Fee', amountPaise: 250000, residenceType: 'all' },
    { id: '2', name: 'Lab Fee', amountPaise: 50000, residenceType: 'all' },
    { id: '3', name: 'Hostel & Mess Fee', amountPaise: 450000, residenceType: 'hosteller' },
    { id: '4', name: 'Day Transport Fee', amountPaise: 120000, residenceType: 'day' }
  ];

  // Day Scholar calculation
  const dayResult = calculateStudentFees(standardFeeHeads, 'day');
  assert.equal(dayResult.subtotalINR, 4200); // 2500 + 500 + 1200
  assert.equal(dayResult.applicableHeadCount, 3);
  assert.equal(dayResult.netINR, 4200);

  // Hosteller calculation
  const hostellerResult = calculateStudentFees(standardFeeHeads, 'hosteller');
  assert.equal(hostellerResult.subtotalINR, 7500); // 2500 + 500 + 4500
  assert.equal(hostellerResult.applicableHeadCount, 3);
  assert.equal(hostellerResult.netINR, 7500);
});

test('Fee Calculation: Flat concession and percentage scholarship', () => {
  const heads: FeeHeadItem[] = [
    { id: '1', name: 'Tuition Fee', amountPaise: 1000000, residenceType: 'all' }
  ];

  // 25% Merit Scholarship
  const scholarshipResult = calculateStudentFees(heads, 'day', { type: 'percentage', value: 25 });
  assert.equal(scholarshipResult.subtotalINR, 10000);
  assert.equal(scholarshipResult.discountINR, 2500);
  assert.equal(scholarshipResult.netINR, 7500);

  // ₹3,000 Flat Staff Concession
  const flatResult = calculateStudentFees(heads, 'day', { type: 'flat', value: 3000 });
  assert.equal(flatResult.discountINR, 3000);
  assert.equal(flatResult.netINR, 7000);
});
