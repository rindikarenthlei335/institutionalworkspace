import test from 'node:test';
import assert from 'node:assert/strict';

export function formatAdmissionNo(year: number, sequenceNum: number): string {
  const padded = String(sequenceNum).padStart(4, '0');
  return `ADM-${year}-${padded}`;
}

export function formatReceiptNo(year: number, sequenceNum: number): string {
  const padded = String(sequenceNum).padStart(5, '0');
  return `RCP-${year}-${padded}`;
}

export function formatApplicationNo(year: number, sequenceNum: number): string {
  const padded = String(sequenceNum).padStart(4, '0');
  return `APP-${year}-${padded}`;
}

test('Sequence Generator: Formats sequential numbers correctly', () => {
  assert.equal(formatAdmissionNo(2025, 1), 'ADM-2025-0001');
  assert.equal(formatAdmissionNo(2025, 42), 'ADM-2025-0042');
  assert.equal(formatAdmissionNo(2025, 1280), 'ADM-2025-1280');

  assert.equal(formatReceiptNo(2025, 1), 'RCP-2025-00001');
  assert.equal(formatReceiptNo(2025, 999), 'RCP-2025-00999');

  assert.equal(formatApplicationNo(2025, 14), 'APP-2025-0014');
});
