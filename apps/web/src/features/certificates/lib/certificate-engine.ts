export interface CertificateMergeData {
  student_name: string;
  admission_no: string;
  class: string;
  section?: string;
  father_name?: string;
  mother_name?: string;
  dob?: string;
  academic_year: string;
  leaving_reason?: string;
  conduct?: string;
  issue_date?: string;
  institution_name: string;
}

export function mergeCertificateFields(
  templateText: string,
  data: CertificateMergeData
): string {
  let result = templateText;
  const entries = Object.entries(data);

  for (const [key, value] of entries) {
    if (value !== undefined && value !== null) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, String(value));
    }
  }

  return result;
}

export function generateCertificateNumber(
  prefix: string,
  sequenceNo: number,
  year: number = new Date().getFullYear()
): string {
  const padded = String(sequenceNo).padStart(3, '0');
  const cleanPrefix = prefix.endsWith('-') ? prefix : `${prefix}-`;
  return `${cleanPrefix}${year}-${padded}`;
}

export function generateCertificateToken(certNumber: string): string {
  const clean = certNumber.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const rand = Math.random().toString(36).substring(2, 7);
  return `cert-${clean}-${rand}`;
}
