import { describe, it } from 'node:test';
import assert from 'node:assert';

// Pure logic validator matching apps/web/src/features/builder/lib/builder-engine.ts
interface CustomFieldDefinition {
  fieldName: string;
  fieldLabel: { en: string; lus: string };
  fieldType: string;
  isRequired: boolean;
  options?: string[];
  defaultValue?: any;
}

function validateRecordData(
  data: Record<string, any>,
  fields: CustomFieldDefinition[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const field of fields) {
    const val = data[field.fieldName];
    if (field.isRequired && (val === undefined || val === null || val === '')) {
      errors.push(`Field '${field.fieldLabel.en}' is required.`);
    }

    if (val !== undefined && val !== null && val !== '') {
      if (field.fieldType === 'number' && typeof val !== 'number' && isNaN(Number(val))) {
        errors.push(`Field '${field.fieldLabel.en}' must be a valid number.`);
      }
      if (field.fieldType === 'phone' && !/^[0-9+ -]{7,15}$/.test(String(val))) {
        errors.push(`Field '${field.fieldLabel.en}' must be a valid phone number.`);
      }
      if (field.fieldType === 'select' && field.options && !field.options.includes(val)) {
        errors.push(`Field '${field.fieldLabel.en}' value '${val}' is not in allowed options.`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

describe('Custom Module Builder (P2-M7)', () => {
  const libraryFields: CustomFieldDefinition[] = [
    { fieldName: 'title', fieldLabel: { en: 'Book Title', lus: 'Lehkhabu Hming' }, fieldType: 'text', isRequired: true },
    { fieldName: 'author', fieldLabel: { en: 'Author', lus: 'Ziaktu' }, fieldType: 'text', isRequired: true },
    { fieldName: 'copies', fieldLabel: { en: 'Total Copies', lus: 'A Zat' }, fieldType: 'number', isRequired: true },
    { fieldName: 'category', fieldLabel: { en: 'Genre', lus: 'Chi' }, fieldType: 'select', isRequired: true, options: ['Science', 'History', 'Mizo'] }
  ];

  const transportFields: CustomFieldDefinition[] = [
    { fieldName: 'route_name', fieldLabel: { en: 'Route Name', lus: 'Kawng Hming' }, fieldType: 'text', isRequired: true },
    { fieldName: 'driver_phone', fieldLabel: { en: 'Driver Phone', lus: 'Driver Phone' }, fieldType: 'phone', isRequired: true }
  ];

  describe('Record Validation Engine', () => {
    it('accepts valid record complying with entity fields', () => {
      const validBook = {
        title: 'Mizo Thawnthu Ropui',
        author: 'B. Lalthangliana',
        copies: 15,
        category: 'Mizo'
      };
      const result = validateRecordData(validBook, libraryFields);
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.errors.length, 0);
    });

    it('rejects record when required field is omitted', () => {
      const invalidBook = {
        author: 'B. Lalthangliana',
        copies: 5,
        category: 'History'
      };
      const result = validateRecordData(invalidBook, libraryFields);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('Book Title') && e.includes('required')));
    });

    it('rejects invalid number input', () => {
      const invalidNumberBook = {
        title: 'Physics',
        author: 'H.C. Verma',
        copies: 'not-a-number',
        category: 'Science'
      };
      const result = validateRecordData(invalidNumberBook, libraryFields);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('must be a valid number')));
    });

    it('validates phone format in transport entity', () => {
      const validTransport = {
        route_name: 'Route 1',
        driver_phone: '+91 98623 54321'
      };
      const validRes = validateRecordData(validTransport, transportFields);
      assert.strictEqual(validRes.valid, true);

      const invalidTransport = {
        route_name: 'Route 1',
        driver_phone: 'badphone'
      };
      const invalidRes = validateRecordData(invalidTransport, transportFields);
      assert.strictEqual(invalidRes.valid, false);
      assert.ok(invalidRes.errors.some(e => e.includes('valid phone number')));
    });

    it('validates select dropdown options', () => {
      const invalidOption = {
        title: 'Unknown',
        author: 'Unknown',
        copies: 1,
        category: 'InvalidGenre'
      };
      const result = validateRecordData(invalidOption, libraryFields);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('not in allowed options')));
    });
  });
});
