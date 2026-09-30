import type { EntitySchema } from '../types';

export const ENTITY_SCHEMAS: Record<string, EntitySchema> = {
  students: {
    entityType: 'students',
    titleEn: 'Students Master Register',
    titleLus: 'Zirlai Master Register',
    uniqueIdentifierKey: 'admission_no',
    instructionNotesEn: [
      'Admission Number (admission_no) must be unique across your school.',
      'Dates must follow YYYY-MM-DD format (e.g. 2012-05-18).',
      'Residence Type must be either "Day Scholar" or "Hosteller".',
      'Gender must be "Male", "Female", or "Other".'
    ],
    instructionNotesLus: [
      'Admission Number hi zirlai tin tan a hran theuh a ni tur a ni.',
      'Date of Birth hi YYYY-MM-DD (entirnan: 2012-05-18) anga ziah tur a ni.',
      'Residence Type-ah "Day Scholar" a nih loh leh "Hosteller" tih tur a ni.'
    ],
    fields: [
      {
        key: 'admission_no',
        labelEn: 'Admission Number',
        labelLus: 'Admission Number',
        type: 'string',
        required: true,
        uniqueKey: true,
        descriptionEn: 'Official unique student admission number',
        sampleValue: 'ADM-2024-0101'
      },
      {
        key: 'full_name',
        labelEn: 'Full Name',
        labelLus: 'Hming Pum',
        type: 'string',
        required: true,
        descriptionEn: 'Student full legal name as per certificates',
        sampleValue: 'Lalrintluanga Sailo'
      },
      {
        key: 'gender',
        labelEn: 'Gender',
        labelLus: 'Mipa / Hmeichhia',
        type: 'select',
        required: true,
        options: ['Male', 'Female', 'Other'],
        sampleValue: 'Male'
      },
      {
        key: 'dob',
        labelEn: 'Date of Birth (YYYY-MM-DD)',
        labelLus: 'Pian Ni (YYYY-MM-DD)',
        type: 'date',
        required: true,
        sampleValue: '2012-08-14'
      },
      {
        key: 'class_name',
        labelEn: 'Class / Standard',
        labelLus: 'Pawl (Class)',
        type: 'select',
        required: true,
        options: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII'],
        sampleValue: 'Class X'
      },
      {
        key: 'section',
        labelEn: 'Section',
        labelLus: 'Section',
        type: 'select',
        required: true,
        options: ['A', 'B', 'C', 'D'],
        sampleValue: 'A'
      },
      {
        key: 'roll_number',
        labelEn: 'Roll Number',
        labelLus: 'Roll Number',
        type: 'number',
        required: false,
        sampleValue: 12
      },
      {
        key: 'residence_type',
        labelEn: 'Residence Type',
        labelLus: 'Day Scholar / Hosteller',
        type: 'select',
        required: true,
        options: ['Day Scholar', 'Hosteller'],
        sampleValue: 'Day Scholar'
      },
      {
        key: 'blood_group',
        labelEn: 'Blood Group',
        labelLus: 'Thisen Group',
        type: 'select',
        required: false,
        options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        sampleValue: 'B+'
      },
      {
        key: 'guardian_name',
        labelEn: 'Guardian / Parent Name',
        labelLus: 'Nu leh Pa / Enkawltu Hming',
        type: 'string',
        required: true,
        sampleValue: 'C. Lalthansanga'
      },
      {
        key: 'guardian_phone',
        labelEn: 'Guardian Phone Number',
        labelLus: 'Nu leh Pa Phone Number',
        type: 'string',
        required: true,
        sampleValue: '+91 98621 11223'
      },
      {
        key: 'address',
        labelEn: 'Permanent Address',
        labelLus: 'Awmna Hmun / Veng',
        type: 'string',
        required: false,
        sampleValue: 'Mission Veng, Aizawl, Mizoram'
      }
    ]
  },

  staff: {
    entityType: 'staff',
    titleEn: 'Staff & Teachers Master Register',
    titleLus: 'Zirtirtute & Thawktute Master Register',
    uniqueIdentifierKey: 'employee_id',
    instructionNotesEn: [
      'Employee ID (employee_id) must be unique across all faculty and staff.',
      'Show on Website must be "Yes" or "No". Selecting "Yes" will automatically publish the teacher to your public Faculty web page.',
      'Dates must follow YYYY-MM-DD format (e.g. 2018-06-01).'
    ],
    instructionNotesLus: [
      'Employee ID hi thawktu tin tan a hran theuh a ni tur a ni.',
      'Website-a tihlan duh tan "Show on Website"-ah "Yes" dah tur a ni.'
    ],
    fields: [
      {
        key: 'employee_id',
        labelEn: 'Employee ID',
        labelLus: 'Employee ID',
        type: 'string',
        required: true,
        uniqueKey: true,
        sampleValue: 'EMP-MC-010'
      },
      {
        key: 'full_name',
        labelEn: 'Full Name',
        labelLus: 'Hming Pum',
        type: 'string',
        required: true,
        sampleValue: 'Dr. Zoramthanga Hmar'
      },
      {
        key: 'gender',
        labelEn: 'Gender',
        labelLus: 'Mipa / Hmeichhia',
        type: 'select',
        required: true,
        options: ['Male', 'Female', 'Other'],
        sampleValue: 'Male'
      },
      {
        key: 'dob',
        labelEn: 'Date of Birth (YYYY-MM-DD)',
        labelLus: 'Pian Ni (YYYY-MM-DD)',
        type: 'date',
        required: true,
        sampleValue: '1982-11-20'
      },
      {
        key: 'designation',
        labelEn: 'Designation / Title',
        labelLus: 'Hna Hming / Designation',
        type: 'string',
        required: true,
        sampleValue: 'Senior PGT Chemistry'
      },
      {
        key: 'department',
        labelEn: 'Department',
        labelLus: 'Department',
        type: 'select',
        required: true,
        options: ['Administration', 'Science', 'Mathematics', 'Humanities', 'Languages', 'Sports & Fitness'],
        sampleValue: 'Science'
      },
      {
        key: 'employment_type',
        labelEn: 'Employment Type',
        labelLus: 'Hnathawh Dan',
        type: 'select',
        required: true,
        options: ['Full Time', 'Part Time', 'Contractual', 'Guest'],
        sampleValue: 'Full Time'
      },
      {
        key: 'qualification',
        labelEn: 'Highest Qualification',
        labelLus: 'Zirna Lam Thiamna',
        type: 'string',
        required: true,
        sampleValue: 'Ph.D. Chemistry, M.Sc., B.Ed.'
      },
      {
        key: 'experience_years',
        labelEn: 'Teaching Experience (Years)',
        labelLus: 'Hnathawh Tawh Zat (Kum)',
        type: 'number',
        required: false,
        sampleValue: 12.5
      },
      {
        key: 'joining_date',
        labelEn: 'Joining Date (YYYY-MM-DD)',
        labelLus: 'Luh Ni (YYYY-MM-DD)',
        type: 'date',
        required: true,
        sampleValue: '2016-04-01'
      },
      {
        key: 'phone',
        labelEn: 'Contact Phone Number',
        labelLus: 'Phone Number',
        type: 'string',
        required: true,
        sampleValue: '+91 94361 55667'
      },
      {
        key: 'email',
        labelEn: 'Official Email',
        labelLus: 'Official Email',
        type: 'string',
        required: true,
        sampleValue: 'zoramthanga@mountcarmel.edu.in'
      },
      {
        key: 'subjects_taught',
        labelEn: 'Subjects Taught (Comma Separated)',
        labelLus: 'Zirlai Zirtir Te (Comma dah zel)',
        type: 'string',
        required: false,
        sampleValue: 'Chemistry, Environmental Science'
      },
      {
        key: 'classes_assigned',
        labelEn: 'Classes Assigned (Comma Separated)',
        labelLus: 'Pawl Zirtir Te',
        type: 'string',
        required: false,
        sampleValue: 'Class XI-A, Class XII-A'
      },
      {
        key: 'class_teacher_of',
        labelEn: 'Class Teacher Of (Optional)',
        labelLus: 'Class Teacher Nihna (A tul chuan)',
        type: 'string',
        required: false,
        sampleValue: 'Class XI-A'
      },
      {
        key: 'show_on_website',
        labelEn: 'Publish to Public Website Faculty (Yes/No)',
        labelLus: 'Website-ah Tihlan Duh Em (Yes/No)',
        type: 'select',
        required: true,
        options: ['Yes', 'No'],
        sampleValue: 'Yes'
      }
    ]
  },

  guardians: {
    entityType: 'guardians',
    titleEn: 'Guardians & Parents Register',
    titleLus: 'Nu leh Pa Master Register',
    uniqueIdentifierKey: 'phone',
    instructionNotesEn: [
      'Phone Number (phone) is used as the unique login key for parents in the parent portal.',
      'Relationship must be "Father", "Mother", or "Guardian".'
    ],
    instructionNotesLus: [
      'Phone Number hi parent portal luhna tur a ni a, a dik tur a ni.'
    ],
    fields: [
      {
        key: 'phone',
        labelEn: 'Primary Phone Number (Unique)',
        labelLus: 'Phone Number',
        type: 'string',
        required: true,
        uniqueKey: true,
        sampleValue: '+91 98621 11223'
      },
      {
        key: 'guardian_name',
        labelEn: 'Guardian Full Name',
        labelLus: 'Nu leh Pa Hming Pum',
        type: 'string',
        required: true,
        sampleValue: 'C. Lalthansanga'
      },
      {
        key: 'relationship',
        labelEn: 'Relationship to Student',
        labelLus: 'Inlaichinna',
        type: 'select',
        required: true,
        options: ['Father', 'Mother', 'Guardian'],
        sampleValue: 'Father'
      },
      {
        key: 'occupation',
        labelEn: 'Occupation',
        labelLus: 'Eizawnna / Hna',
        type: 'string',
        required: false,
        sampleValue: 'Government Officer'
      },
      {
        key: 'email',
        labelEn: 'Email Address',
        labelLus: 'Email',
        type: 'string',
        required: false,
        sampleValue: 'lalthansanga.c@gmail.com'
      },
      {
        key: 'address',
        labelEn: 'Residential Address',
        labelLus: 'Awmna Hmun',
        type: 'string',
        required: false,
        sampleValue: 'Mission Veng, Aizawl, Mizoram'
      }
    ]
  },

  subjects: {
    entityType: 'subjects',
    titleEn: 'Class & Subjects Curriculum Master',
    titleLus: 'Zirlai Thupui (Subjects) Master',
    uniqueIdentifierKey: 'code',
    instructionNotesEn: [
      'Subject Code (code) must be unique (e.g. MATH-10, SCI-09).',
      'Max Marks and Pass Marks must be positive numbers.'
    ],
    instructionNotesLus: [
      'Subject Code hi a hran theuh a ni tur a ni.'
    ],
    fields: [
      {
        key: 'code',
        labelEn: 'Subject Code',
        labelLus: 'Subject Code',
        type: 'string',
        required: true,
        uniqueKey: true,
        sampleValue: 'MATH-10'
      },
      {
        key: 'name',
        labelEn: 'Subject Title',
        labelLus: 'Subject Hming',
        type: 'string',
        required: true,
        sampleValue: 'Mathematics'
      },
      {
        key: 'class_name',
        labelEn: 'Applicable Class',
        labelLus: 'Zirna Pawl',
        type: 'string',
        required: true,
        sampleValue: 'Class X'
      },
      {
        key: 'is_optional',
        labelEn: 'Is Optional / Elective (Yes/No)',
        labelLus: 'Optional Subject A Ni Em (Yes/No)',
        type: 'select',
        required: true,
        options: ['Yes', 'No'],
        sampleValue: 'No'
      },
      {
        key: 'max_marks',
        labelEn: 'Maximum Marks',
        labelLus: 'Marks Hmuh Theih Sang Ber',
        type: 'number',
        required: true,
        sampleValue: 100
      },
      {
        key: 'pass_marks',
        labelEn: 'Passing Marks Threshold',
        labelLus: 'Tlinna Marks',
        type: 'number',
        required: true,
        sampleValue: 33
      }
    ]
  },

  opening_balances: {
    entityType: 'opening_balances',
    titleEn: 'Fee Dues & Opening Balances',
    titleLus: 'Fee Ba Hmasate (Opening Balances)',
    uniqueIdentifierKey: 'admission_no',
    instructionNotesEn: [
      'Use this to migrate pending fee dues from your previous academic year into EduPortal.',
      'Admission Number must match an existing student in the Students Master Register.'
    ],
    instructionNotesLus: [
      'Zir kum hmasa atanga fee ba la awm te lakluhna a ni.'
    ],
    fields: [
      {
        key: 'admission_no',
        labelEn: 'Student Admission Number',
        labelLus: 'Student Admission Number',
        type: 'string',
        required: true,
        uniqueKey: true,
        sampleValue: 'ADM-2024-0012'
      },
      {
        key: 'student_name',
        labelEn: 'Student Name',
        labelLus: 'Zirlai Hming',
        type: 'string',
        required: true,
        sampleValue: 'Lalhmangaiha'
      },
      {
        key: 'previous_academic_year',
        labelEn: 'Previous Academic Year (e.g. 2025-2026)',
        labelLus: 'Zir Kum Hmasa (2025-2026)',
        type: 'string',
        required: true,
        sampleValue: '2025-2026'
      },
      {
        key: 'opening_due_inr',
        labelEn: 'Pending Fee Due Amount (INR)',
        labelLus: 'Fee Bat Zat (₹)',
        type: 'number',
        required: true,
        sampleValue: 4500
      }
    ]
  }
};
