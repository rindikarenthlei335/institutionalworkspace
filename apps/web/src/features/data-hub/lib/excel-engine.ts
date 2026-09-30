import * as XLSX from 'xlsx';
import type { EntitySchema, DataHubEntityType, ImportMode, DryRunResult, DryRunRowResult, ImportErrorRecord } from '../types';

/**
 * Generates an official .xlsx template with two sheets:
 * 1. Data_Template (headers + sample row)
 * 2. Instructions_and_Options (field notes and dropdown lists)
 */
export function generateEntityTemplate(schema: EntitySchema, language: 'en' | 'lus' = 'en'): Uint8Array {
  const wb = XLSX.utils.book_new();

  // 1. Data Sheet
  const headerKeys = schema.fields.map(f => language === 'lus' ? f.labelLus : f.key);
  const sampleValues = schema.fields.map(f => f.sampleValue);

  const wsData = [headerKeys, sampleValues];
  const ws1 = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws1['!cols'] = schema.fields.map(() => ({ wch: 22 }));

  XLSX.utils.book_append_sheet(wb, ws1, 'Data_Entry');

  // 2. Instructions Sheet
  const instructionHeader = language === 'lus'
    ? ['Field Key', 'Field Name', 'A Tul Em (Required)', 'Type', 'A Thlan Theih Te (Allowed Options)', 'Hriattur']
    : ['Field Key', 'Field Name', 'Required', 'Type', 'Allowed Options', 'Description'];

  const instructionRows = schema.fields.map(f => [
    f.key,
    language === 'lus' ? f.labelLus : f.labelEn,
    f.required ? 'YES' : 'Optional',
    f.type.toUpperCase(),
    f.options ? f.options.join(', ') : 'Any text / value',
    f.descriptionEn || ''
  ]);

  const generalNotes = language === 'lus' ? schema.instructionNotesLus : schema.instructionNotesEn;
  const notesRows = [
    [],
    [language === 'lus' ? 'HRIATTUR PAWIMAWH TE:' : 'IMPORTANT INSTRUCTIONS:'],
    ...generalNotes.map(n => [n])
  ];

  const ws2Data = [instructionHeader, ...instructionRows, ...notesRows];
  const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
  ws2['!cols'] = [{ wch: 18 }, { wch: 24 }, { wch: 12 }, { wch: 12 }, { wch: 35 }, { wch: 45 }];

  XLSX.utils.book_append_sheet(wb, ws2, 'Instructions_and_Rules');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(excelBuffer);
}

/**
 * Triggers a browser download of an ArrayBuffer / Uint8Array
 */
export function downloadExcelBufferInBrowser(data: Uint8Array, fileName: string): void {
  const blob = new Blob([data as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parses an uploaded .xlsx or .csv File in the browser
 */
export async function parseExcelFile(file: File): Promise<{ headers: string[]; rows: Record<string, any>[] }> {
  const arrayBuffer = await file.arrayBuffer();
  const wb = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });

  const firstSheetName = wb.SheetNames[0];
  const worksheet = wb.Sheets[firstSheetName];

  // Convert to JSON
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (rawRows.length === 0) {
    return { headers: [], rows: [] };
  }

  // Extract column headers
  const headers = Object.keys(rawRows[0] || {});

  // Clean strings in rows
  const cleanedRows = rawRows.map(row => {
    const cleanedRow: Record<string, any> = {};
    for (const [key, val] of Object.entries(row)) {
      if (val instanceof Date) {
        // Format date as YYYY-MM-DD
        const yyyy = val.getFullYear();
        const mm = String(val.getMonth() + 1).padStart(2, '0');
        const dd = String(val.getDate()).padStart(2, '0');
        cleanedRow[key.trim()] = `${yyyy}-${mm}-${dd}`;
      } else {
        cleanedRow[key.trim()] = typeof val === 'string' ? val.trim() : val;
      }
    }
    return cleanedRow;
  });

  return { headers, rows: cleanedRows };
}

/**
 * Auto-detects matching column mappings between file headers and schema fields
 */
export function autoDetectColumnMapping(
  fileHeaders: string[],
  schema: EntitySchema
): Record<string, string> {
  const mapping: Record<string, string> = {};

  for (const field of schema.fields) {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

    const fieldKeyNorm = normalize(field.key);
    const labelEnNorm = normalize(field.labelEn);
    const labelLusNorm = normalize(field.labelLus);

    const match = fileHeaders.find(h => {
      const hNorm = normalize(h);
      return (
        hNorm === fieldKeyNorm ||
        hNorm === labelEnNorm ||
        hNorm === labelLusNorm ||
        hNorm.includes(fieldKeyNorm) ||
        fieldKeyNorm.includes(hNorm)
      );
    });

    if (match) {
      mapping[field.key] = match;
    } else {
      mapping[field.key] = ''; // Unmapped
    }
  }

  return mapping;
}

export interface ValidateAndDryRunParams {
  schema: EntitySchema;
  rows: Record<string, any>[];
  mapping: Record<string, string>;
  mode: ImportMode;
  existingIdentifiers?: Set<string>;
  existingRecordsMap?: Map<string, Record<string, any>>;
}

/**
 * Validates parsed rows, generates row-level diffs, checks uniqueness, and performs dry-run
 */
export function validateAndDryRun({
  schema,
  rows,
  mapping,
  mode,
  existingIdentifiers = new Set(),
  existingRecordsMap = new Map()
}: ValidateAndDryRunParams): DryRunResult {
  const resultRows: DryRunRowResult[] = [];
  const errors: ImportErrorRecord[] = [];
  const seenFileIdentifiers = new Set<string>();

  let toCreate = 0;
  let toUpdate = 0;
  let toSkip = 0;
  let errorCount = 0;

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // Row 1 is header
    const rowErrors: string[] = [];
    const rowWarnings: string[] = [];
    const mappedData: Record<string, any> = {};

    // Map each field using the mapping table
    for (const field of schema.fields) {
      const sourceCol = mapping[field.key];
      const rawValue = sourceCol ? row[sourceCol] : undefined;

      // Required check
      if (field.required && (rawValue === undefined || rawValue === null || rawValue === '')) {
        const msg = `Required field "${field.labelEn}" is missing or empty.`;
        rowErrors.push(msg);
        errors.push({
          rowNumber,
          fieldName: field.key,
          valueProvided: '',
          errorType: 'required_missing',
          errorMessage: msg
        });
      }

      // Dropdown / options check
      if (field.options && rawValue) {
        const valStr = String(rawValue).trim().toLowerCase();
        const matchedOpt = field.options.find(opt => opt.toLowerCase() === valStr);
        if (!matchedOpt) {
          const msg = `Value "${rawValue}" is not a valid option for ${field.labelEn}. Allowed: [${field.options.join(', ')}]`;
          rowErrors.push(msg);
          errors.push({
            rowNumber,
            fieldName: field.key,
            valueProvided: String(rawValue),
            errorType: 'invalid_option',
            errorMessage: msg
          });
        } else {
          mappedData[field.key] = matchedOpt;
        }
      } else {
        mappedData[field.key] = rawValue;
      }
    }

    const uniqueIdVal = String(mappedData[schema.uniqueIdentifierKey] || '').trim();

    // Check for internal duplicate inside spreadsheet
    if (uniqueIdVal) {
      if (seenFileIdentifiers.has(uniqueIdVal.toLowerCase())) {
        const msg = `Duplicate ${schema.uniqueIdentifierKey} "${uniqueIdVal}" found multiple times in the uploaded file.`;
        rowErrors.push(msg);
        errors.push({
          rowNumber,
          fieldName: schema.uniqueIdentifierKey,
          valueProvided: uniqueIdVal,
          errorType: 'duplicate_key',
          errorMessage: msg
        });
      }
      seenFileIdentifiers.add(uniqueIdVal.toLowerCase());
    }

    // Determine Action and Diff based on Mode & Existing Records
    const existsInDb = uniqueIdVal ? existingIdentifiers.has(uniqueIdVal.toLowerCase()) : false;
    let action: 'create' | 'update' | 'skip' | 'error' = 'create';
    const diff: Record<string, { oldVal: any; newVal: any }> = {};

    if (rowErrors.length > 0) {
      action = 'error';
      errorCount++;
    } else if (mode === 'create_only') {
      if (existsInDb) {
        action = 'error';
        const msg = `Record "${uniqueIdVal}" already exists in the system (Create Only mode).`;
        rowErrors.push(msg);
        errors.push({
          rowNumber,
          fieldName: schema.uniqueIdentifierKey,
          valueProvided: uniqueIdVal,
          errorType: 'duplicate_key',
          errorMessage: msg
        });
        errorCount++;
      } else {
        action = 'create';
        toCreate++;
      }
    } else if (mode === 'update_only') {
      if (!existsInDb) {
        action = 'error';
        const msg = `Record "${uniqueIdVal}" does not exist in the system to update (Update Only mode).`;
        rowErrors.push(msg);
        errors.push({
          rowNumber,
          fieldName: schema.uniqueIdentifierKey,
          valueProvided: uniqueIdVal,
          errorType: 'duplicate_key',
          errorMessage: msg
        });
        errorCount++;
      } else {
        action = 'update';
        toUpdate++;
      }
    } else {
      // Upsert mode
      if (existsInDb) {
        action = 'update';
        toUpdate++;

        // Compute diff if old record is available
        const oldRec = existingRecordsMap.get(uniqueIdVal.toLowerCase());
        if (oldRec) {
          for (const [k, newVal] of Object.entries(mappedData)) {
            const oldVal = oldRec[k];
            if (oldVal !== undefined && String(oldVal) !== String(newVal)) {
              diff[k] = { oldVal, newVal };
            }
          }
        }
      } else {
        action = 'create';
        toCreate++;
      }
    }

    resultRows.push({
      rowNumber,
      action,
      uniqueIdentifier: uniqueIdVal || `Row ${rowNumber}`,
      summary: mappedData['full_name'] || mappedData['name'] || mappedData['guardian_name'] || uniqueIdVal,
      data: mappedData,
      errors: rowErrors.length > 0 ? rowErrors : undefined,
      warnings: rowWarnings.length > 0 ? rowWarnings : undefined,
      diff: Object.keys(diff).length > 0 ? diff : undefined
    });
  });

  return {
    totalRows: rows.length,
    toCreate,
    toUpdate,
    toSkip,
    errorCount,
    rows: resultRows,
    errors,
    isValid: errorCount === 0
  };
}

/**
 * Exports data to an .xlsx file in the browser
 */
export function exportDataToExcel(data: Record<string, any>[], sheetName: string, fileName: string): void {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  downloadExcelBufferInBrowser(new Uint8Array(buf), fileName);
}

/**
 * Exports data to a .csv file in the browser
 */
export function exportDataToCSV(data: Record<string, any>[], fileName: string): void {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
