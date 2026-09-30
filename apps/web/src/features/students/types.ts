export interface Student {
  id: string;
  tenantId: string;
  admissionNo: string;
  rollNo?: number;
  fullName: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  residenceType: 'day' | 'hosteller';
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  classId: string;
  className: string;
  sectionId?: string;
  sectionName?: string;
  admissionDate: string;
  address?: string;
  bloodGroup?: string;
  photoUrl?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  createdAt: string;
}

export interface Guardian {
  id: string;
  tenantId: string;
  studentId: string;
  relation: string;
  fullName: string;
  phone: string;
  email?: string;
}
