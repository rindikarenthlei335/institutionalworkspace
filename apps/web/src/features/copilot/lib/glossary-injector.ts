export interface GlossaryDefinition {
  school_terms: Record<string, string>;
  product_terms: Record<string, string>;
}

export const OFFICIAL_MIZO_GLOSSARY: GlossaryDefinition = {
  school_terms: {
    school: "School / Sikul",
    principal: "Principal / Sikul Lu",
    headmaster: "Headmaster",
    teacher: "Zirtirtu",
    student: "Zirlai",
    parent: "Nu leh Pa",
    guardian: "Enkawltu / Nu-leh-pa",
    academic_year: "Zir Kum / Academic Year",
    class: "Pawl / Class",
    section: "Section",
    subject: "Zirlai Thupui / Subject",
    admission: "Luh Dilna / Admission",
    admission_number: "Admission Number",
    roll_number: "Roll Number",
    day_scholar: "Day Scholar (In atanga kal)",
    hosteller: "Hosteller (Hostel-a awm)",
    fee: "School Fee",
    tuition_fee: "Zirna Fee / Tuition Fee",
    hostel_fee: "Hostel Fee",
    due_amount: "Ba La Awm / Fee Ba",
    receipt: "Pawisa Chhina / Receipt",
    exam: "Exam / Endikna",
    marks: "Marks / Hmuhzat",
    marksheet: "Marksheet / Result Sheet",
    grade: "Grade",
    rank: "Rank / Dinhmun",
    passed: "Tling / Tlang",
    failed: "Tla / Tlinglo",
    attendance: "Kallam / Attendance",
    present: "Kal / Present",
    absent: "Kallo / Absent",
    id_card: "ID Card / Hriatpuina Card",
    notice: "Thuchhuah / Hriattirna",
    gallery: "Thlalak / Gallery",
    faculty: "Zirtirtute Roster",
    transfer_certificate: "Sikul Insaun Hriatpuina (TC)"
  },
  product_terms: {
    dashboard: "Dashboard / Hmuhchhuahna Hmun",
    settings: "Inremremna / Settings",
    service_store: "Service Dawr / Add-on Store",
    data_hub: "Data Hub / Hriatna Khawl",
    import_excel: "Excel atanga Lakluh / Import",
    export_excel: "Excel-a Thawnchhuah / Export",
    custom_module: "Module Siamsa / Custom Module",
    module_manager: "Module Enkawlna",
    ai_copilot: "AI Tanpuitu / AI Copilot",
    domain: "Domain Name",
    custom_domain: "Mahni Domain",
    subdomain: "Platform Subdomain",
    active: "Nung / Active",
    pending: "Nghah mek / Pending",
    completed: "Zo tawh / Completed",
    under_review: "Enfiah mek / Under Review",
    approved: "Pawm tawh / Approved",
    rejected: "Hnar / Rejected"
  }
};

export function getGlossaryPrompt(language: 'en' | 'lus' = 'lus'): string {
  if (language !== 'lus') {
    return '';
  }

  const schoolLines = Object.entries(OFFICIAL_MIZO_GLOSSARY.school_terms)
    .map(([key, val]) => `  - ${key}: ${val}`)
    .join('\n');

  const productLines = Object.entries(OFFICIAL_MIZO_GLOSSARY.product_terms)
    .map(([key, val]) => `  - ${key}: ${val}`)
    .join('\n');

  return `\n\n### OFFICIAL MIZO (LUS) TERMINOLOGY GLOSSARY:
When responding in Mizo, you MUST strictly adhere to these official educational and product terms:
[School Terms]:
${schoolLines}

[Product Terms]:
${productLines}
Ensure respectful, natural Mizoram educational tone, using official educational vocabulary (e.g. Zirtirtu, Zirlai, Nu leh Pa, Thuchhuah, Pawl, Marksheet, Ba la awm).\n`;
}
