import test from 'node:test';
import assert from 'node:assert/strict';
import {
  autoDetectColumnMapping,
  validateAndDryRun
} from '../apps/web/src/features/data-hub/lib/excel-engine.ts';
import { ENTITY_SCHEMAS } from '../apps/web/src/features/data-hub/data/schemas.ts';

test('Excel Engine: autoDetectColumnMapping matches keys and bilingual labels', () => {
  const schema = ENTITY_SCHEMAS.students;
  const uploadedHeaders = [
    'admission_no',
    'Full Name',
    'Mipa / Hmeichhia', // Mizo label for gender
    'dob',
    'Class / Standard',
    'Section',
    'Residence Type',
    'Guardian / Parent Name',
    'Guardian Phone Number'
  ];

  const mapping = autoDetectColumnMapping(uploadedHeaders, schema);

  assert.equal(mapping.admission_no, 'admission_no');
  assert.equal(mapping.full_name, 'Full Name');
  assert.equal(mapping.gender, 'Mipa / Hmeichhia');
  assert.equal(mapping.dob, 'dob');
  assert.equal(mapping.guardian_phone, 'Guardian Phone Number');
});

test('Excel Engine: validateAndDryRun catches missing required fields and invalid options', () => {
  const schema = ENTITY_SCHEMAS.students;
  const mapping = {
    admission_no: 'adm',
    full_name: 'name',
    gender: 'gen',
    dob: 'birth_date',
    class_name: 'class',
    section: 'sec',
    residence_type: 'res_type',
    guardian_name: 'parent',
    guardian_phone: 'phone'
  };

  const sampleRows = [
    {
      adm: 'ADM-101',
      name: 'Lalengmawia',
      gen: 'InvalidGender', // Invalid option!
      birth_date: '2012-04-10',
      class: 'Class X',
      sec: 'A',
      res_type: 'Day Scholar',
      parent: 'Lalthanpuia',
      phone: '+91 94361 22334'
    },
    {
      adm: 'ADM-102',
      name: '', // Missing required name!
      gen: 'Male',
      birth_date: '2012-05-12',
      class: 'Class X',
      sec: 'B',
      res_type: 'Hosteller',
      parent: 'Lalnunmawia',
      phone: '+91 94361 55667'
    }
  ];

  const result = validateAndDryRun({
    schema,
    rows: sampleRows,
    mapping,
    mode: 'upsert'
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errorCount, 2);
  assert.match(result.errors[0].errorMessage, /is not a valid option/);
  assert.match(result.errors[1].errorMessage, /Required field/);
});

test('Excel Engine: validateAndDryRun differentiates create, update, and detects duplicates', () => {
  const schema = ENTITY_SCHEMAS.students;
  const mapping = {
    admission_no: 'adm',
    full_name: 'name',
    gender: 'gen',
    dob: 'birth_date',
    class_name: 'class',
    section: 'sec',
    residence_type: 'res_type',
    guardian_name: 'parent',
    guardian_phone: 'phone'
  };

  const existingIdentifiers = new Set(['adm-101']); // ADM-101 already in database
  const existingRecordsMap = new Map([
    ['adm-101', { admission_no: 'ADM-101', full_name: 'Lalengmawia Old', class_name: 'Class IX' }]
  ]);

  const sampleRows = [
    {
      adm: 'ADM-101', // Existing -> will update and produce diff
      name: 'Lalengmawia Updated',
      gen: 'Male',
      birth_date: '2012-04-10',
      class: 'Class X', // Changed from IX to X
      sec: 'A',
      res_type: 'Day Scholar',
      parent: 'Lalthanpuia',
      phone: '+91 94361 22334'
    },
    {
      adm: 'ADM-102', // New -> will create
      name: 'Vanlalruata',
      gen: 'Male',
      birth_date: '2012-08-20',
      class: 'Class X',
      sec: 'A',
      res_type: 'Day Scholar',
      parent: 'Lalbiaka',
      phone: '+91 98621 88990'
    },
    {
      adm: 'ADM-102', // Duplicate in file!
      name: 'Vanlalruata Duplicated',
      gen: 'Male',
      birth_date: '2012-08-20',
      class: 'Class X',
      sec: 'A',
      res_type: 'Day Scholar',
      parent: 'Lalbiaka',
      phone: '+91 98621 88990'
    }
  ];

  const result = validateAndDryRun({
    schema,
    rows: sampleRows,
    mapping,
    mode: 'upsert',
    existingIdentifiers,
    existingRecordsMap
  });

  assert.equal(result.toUpdate, 1);
  assert.equal(result.toCreate, 1);
  assert.equal(result.errorCount, 1); // Row 3 is duplicate in file
  assert.equal(result.rows[0].action, 'update');
  assert.equal(result.rows[1].action, 'create');
  assert.equal(result.rows[2].action, 'error');
  assert.ok(result.rows[0].diff?.full_name);
});
