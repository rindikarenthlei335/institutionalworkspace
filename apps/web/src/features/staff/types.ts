export type StaffDepartment =
  | 'Administration'
  | 'Science'
  | 'Mathematics'
  | 'Humanities'
  | 'Languages'
  | 'Sports & Fitness';

export type EmploymentType = 'full_time' | 'part_time' | 'contractual' | 'guest';

export type StaffStatus = 'active' | 'on_leave' | 'resigned' | 'terminated';

export interface StaffProfile {
  id: string;
  tenantId: string;
  employeeId: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dob?: string;
  photoUrl?: string;
  designation: string;
  department: StaffDepartment;
  employmentType: EmploymentType;
  qualification: string;
  experienceYears: number;
  joiningDate: string;
  phone: string;
  email: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  idDocumentType?: string;
  idDocumentNumber?: string;
  subjectsTaught: string[];
  classesAssigned: string[];
  classTeacherOf?: string;
  showOnWebsite: boolean;
  websiteBio?: string;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
}
