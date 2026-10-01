export type CustomFieldType =
  | 'text'
  | 'long_text'
  | 'number'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'phone'
  | 'email'
  | 'url'
  | 'file'
  | 'image'
  | 'relation'
  | 'calculated';

export interface CustomFieldDefinition {
  fieldName: string;
  fieldLabel: { en: string; lus: string };
  fieldType: CustomFieldType;
  isRequired: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface CustomEntityTemplate {
  name: { en: string; lus: string };
  slug: string;
  icon: string;
  description: { en: string; lus: string };
  fields: CustomFieldDefinition[];
}

export const BUILDER_TEMPLATES: Record<string, CustomEntityTemplate> = {
  library: {
    name: { en: 'Library Books Catalog', lus: 'Lehkhabu Enkawlna' },
    slug: 'library',
    icon: '📚',
    description: {
      en: 'Track institutional library books, ISBN codes, shelf location, and available copies.',
      lus: 'School library lehkhabu, ISBN, leh copy awm zat vawn thatna.'
    },
    fields: [
      { fieldName: 'title', fieldLabel: { en: 'Book Title', lus: 'Lehkhabu Hming' }, fieldType: 'text', isRequired: true },
      { fieldName: 'author', fieldLabel: { en: 'Author / Writer', lus: 'Ziaktu' }, fieldType: 'text', isRequired: true },
      { fieldName: 'isbn', fieldLabel: { en: 'ISBN Code', lus: 'ISBN Code' }, fieldType: 'text', isRequired: false },
      { fieldName: 'genre', fieldLabel: { en: 'Genre', lus: 'Chi Hrang' }, fieldType: 'select', isRequired: true, options: ['Literature', 'Science', 'Mathematics', 'History', 'Mizo Studies'] },
      { fieldName: 'copies', fieldLabel: { en: 'Total Copies', lus: 'Copy Awm Zat' }, fieldType: 'number', isRequired: true, defaultValue: 1 }
    ]
  },

  transport: {
    name: { en: 'Transport & Bus Fleet', lus: 'School Bus & Kawng Kal' },
    slug: 'transport',
    icon: '🚌',
    description: {
      en: 'Manage school buses, van routes, driver contacts, vehicle numbers, and monthly fares.',
      lus: 'School bus, driver biakpawhna, leh thla tina fee chawi tur enkawlna.'
    },
    fields: [
      { fieldName: 'route_name', fieldLabel: { en: 'Route Name', lus: 'Kawng Hming' }, fieldType: 'text', isRequired: true },
      { fieldName: 'vehicle_no', fieldLabel: { en: 'Vehicle Registration', lus: 'Bus Number' }, fieldType: 'text', isRequired: true },
      { fieldName: 'driver_name', fieldLabel: { en: 'Driver Name', lus: 'Driver Hming' }, fieldType: 'text', isRequired: true },
      { fieldName: 'driver_phone', fieldLabel: { en: 'Driver Phone', lus: 'Driver Phone' }, fieldType: 'phone', isRequired: true },
      { fieldName: 'monthly_fare', fieldLabel: { en: 'Monthly Fare (₹)', lus: 'Thla Tin Fee (₹)' }, fieldType: 'currency', isRequired: true }
    ]
  },

  homework: {
    name: { en: 'Daily Homework & Tasks', lus: 'In Lama Zir Tur (Homework)' },
    slug: 'homework',
    icon: '📝',
    description: {
      en: 'Subject homework assignments, submission deadlines, instructions, and attachments.',
      lus: 'Subject tina homework thehluh hun leh tih tur ruahmanna.'
    },
    fields: [
      { fieldName: 'title', fieldLabel: { en: 'Assignment Title', lus: 'Homework Hming' }, fieldType: 'text', isRequired: true },
      { fieldName: 'subject', fieldLabel: { en: 'Subject', lus: 'Subject' }, fieldType: 'select', isRequired: true, options: ['English', 'Mizo', 'Mathematics', 'Science', 'Social Studies'] },
      { fieldName: 'due_date', fieldLabel: { en: 'Submission Due Date', lus: 'Thehluh Hun Tawp' }, fieldType: 'date', isRequired: true },
      { fieldName: 'instructions', fieldLabel: { en: 'Instructions', lus: 'Hriattirna' }, fieldType: 'long_text', isRequired: false }
    ]
  },

  events: {
    name: { en: 'Institutional Events & Calendar', lus: 'School Thil Thleng & Calendar' },
    slug: 'events',
    icon: '📅',
    description: {
      en: 'School calendar, sports meets, cultural festivals, parent meetings, and public notices.',
      lus: 'Sports, inhmukhawm, leh chawlhkar chhinchhiahna.'
    },
    fields: [
      { fieldName: 'title', fieldLabel: { en: 'Event Title', lus: 'Hun Hming' }, fieldType: 'text', isRequired: true },
      { fieldName: 'event_date', fieldLabel: { en: 'Event Date', lus: 'A Ni' }, fieldType: 'date', isRequired: true },
      { fieldName: 'category', fieldLabel: { en: 'Category', lus: 'Chi' }, fieldType: 'select', isRequired: true, options: ['Sports', 'Academic', 'Holiday', 'Meeting'] },
      { fieldName: 'venue', fieldLabel: { en: 'Venue', lus: 'Hmun' }, fieldType: 'text', isRequired: true }
    ]
  },

  visitors: {
    name: { en: 'Gate Visitors Log', lus: 'Kawtchhuah Mikhual Roster' },
    slug: 'visitors',
    icon: '📋',
    description: {
      en: 'Campus visitor check-in, contact numbers, person to meet, gate pass number, and exit time.',
      lus: 'School kawta lo kal mikhual chhinchhiahna leh biak duh hming.'
    },
    fields: [
      { fieldName: 'visitor_name', fieldLabel: { en: 'Visitor Name', lus: 'Mikhual Hming' }, fieldType: 'text', isRequired: true },
      { fieldName: 'phone', fieldLabel: { en: 'Phone Number', lus: 'Phone Number' }, fieldType: 'phone', isRequired: true },
      { fieldName: 'person_to_meet', fieldLabel: { en: 'Person to Meet', lus: 'Biak Duh Hming' }, fieldType: 'text', isRequired: true },
      { fieldName: 'purpose', fieldLabel: { en: 'Purpose of Visit', lus: 'Kal Chhan' }, fieldType: 'text', isRequired: true }
    ]
  },

  inventory: {
    name: { en: 'Campus Inventory & Assets', lus: 'School Bungrua & Asset' },
    slug: 'inventory',
    icon: '🏷️',
    description: {
      en: 'Lab equipment, sports gear, classroom furniture, projectors, and maintenance logs.',
      lus: 'Lab bungrua, sports gear, thuthleng, leh computer vawn thatna.'
    },
    fields: [
      { fieldName: 'item_name', fieldLabel: { en: 'Item Name', lus: 'Bungraw Hming' }, fieldType: 'text', isRequired: true },
      { fieldName: 'category', fieldLabel: { en: 'Category', lus: 'Category' }, fieldType: 'select', isRequired: true, options: ['Computer Lab', 'Science Lab', 'Sports', 'Classroom'] },
      { fieldName: 'quantity', fieldLabel: { en: 'Quantity', lus: 'A Zat' }, fieldType: 'number', isRequired: true },
      { fieldName: 'room_location', fieldLabel: { en: 'Room / Lab', lus: 'Room Awmna' }, fieldType: 'text', isRequired: true }
    ]
  }
};

export function validateRecordData(
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
