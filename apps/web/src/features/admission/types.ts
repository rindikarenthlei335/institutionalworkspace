export interface AdmissionApplication {
  id: string;
  tenantId: string;
  applicationNo: string;
  studentName: string;
  dob: string;
  gender: string;
  residenceType: 'day' | 'hosteller';
  className: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address?: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'waitlisted' | 'enrolled';
  parentConsent: boolean;
  notes?: string;
  createdAt: string;
}
