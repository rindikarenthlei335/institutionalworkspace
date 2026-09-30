export type DataHubEntityType = 'students' | 'guardians' | 'staff' | 'subjects' | 'opening_balances';

export type ImportMode = 'create_only' | 'update_only' | 'upsert';

export type ImportBatchStatus =
  | 'pending'
  | 'validating'
  | 'dry_run_success'
  | 'completed'
  | 'rolled_back'
  | 'failed';

export interface EntityFieldDefinition {
  key: string;
  labelEn: string;
  labelLus: string;
  type: 'string' | 'number' | 'date' | 'select' | 'boolean';
  required: boolean;
  uniqueKey?: boolean;
  options?: string[]; // Allowed dropdown options
  descriptionEn?: string;
  sampleValue: string | number;
}

export interface EntitySchema {
  entityType: DataHubEntityType;
  titleEn: string;
  titleLus: string;
  uniqueIdentifierKey: string; // e.g. 'admission_no' or 'employee_id'
  fields: EntityFieldDefinition[];
  instructionNotesEn: string[];
  instructionNotesLus: string[];
}

export interface ImportErrorRecord {
  rowNumber: number;
  fieldName?: string;
  valueProvided?: string;
  errorType: 'duplicate_key' | 'invalid_date' | 'required_missing' | 'invalid_option' | 'format_error';
  errorMessage: string;
}

export interface DryRunRowResult {
  rowNumber: number;
  action: 'create' | 'update' | 'skip' | 'error';
  uniqueIdentifier: string;
  summary: string;
  data: Record<string, any>;
  errors?: string[];
  warnings?: string[];
  diff?: Record<string, { oldVal: any; newVal: any }>;
}

export interface DryRunResult {
  totalRows: number;
  toCreate: number;
  toUpdate: number;
  toSkip: number;
  errorCount: number;
  rows: DryRunRowResult[];
  errors: ImportErrorRecord[];
  isValid: boolean;
}

export interface ImportBatchRecord {
  id: string;
  batchNumber: string;
  entityType: DataHubEntityType;
  mode: ImportMode;
  fileName: string;
  totalRows: number;
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
  status: ImportBatchStatus;
  snapshotData?: Record<string, any>;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}
