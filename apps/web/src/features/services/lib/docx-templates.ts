import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType
} from 'docx';

export interface SchoolDetailsForDocx {
  schoolName: string;
  principalName: string;
  address: string;
  phone: string;
  email: string;
  boardAffiliation?: string;
  affiliationNumber?: string;
  requestedDomain?: string;
}

/**
 * Generates an official Institution Authorisation Letter as a .docx Document
 */
export function createSchoolAuthorisationDocx(details: SchoolDetailsForDocx): Document {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header / Letterhead placeholder
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '[ OFFICIAL INSTITUTION LETTERHEAD PLACEHOLDER ]',
                bold: true,
                color: '888888',
                size: 20
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: details.schoolName.toUpperCase(),
                bold: true,
                size: 32,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `${details.address} | Tel: ${details.phone} | Email: ${details.email}`,
                size: 20,
                color: '4B5563'
              })
            ]
          }),

          // Date and Reference
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`,
                bold: true,
                size: 22
              })
            ]
          }),

          // Subject
          new Paragraph({
            spacing: { before: 200, after: 300 },
            children: [
              new TextRun({
                text: 'SUBJECT: INSTITUTIONAL AUTHORISATION & APPOINTMENT LETTER',
                bold: true,
                underline: {},
                size: 24
              })
            ]
          }),

          // Body text
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'To Whom It May Concern,',
                bold: true,
                size: 22
              })
            ]
          }),

          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `This is to certify that `,
                size: 22
              }),
              new TextRun({
                text: details.schoolName,
                bold: true,
                size: 22
              }),
              new TextRun({
                text: ` (Affiliation No: ${details.affiliationNumber || 'Recognised / Pending'}), functioning at ${details.address}, hereby authorises the EduPortal SaaS Platform Engineering & Operations Division to represent our institution for online services and digital infrastructure setup.`,
                size: 22
              })
            ]
          }),

          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `Specifically, EduPortal is granted full authority to verify DNS zones, submit sitemaps, verify institutional identity with Google Search Console and Google Maps, and manage the technical DNS configurations for our official school domain.`,
                size: 22
              })
            ]
          }),

          new Paragraph({
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `We confirm that the information provided is true and legitimate under our institutional records.`,
                size: 22
              })
            ]
          }),

          // Sign-off section
          new Paragraph({
            spacing: { before: 400, after: 120 },
            children: [
              new TextRun({
                text: 'Yours faithfully,',
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 600, after: 80 },
            children: [
              new TextRun({
                text: '____________________________________',
                size: 22
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: details.principalName,
                bold: true,
                size: 24
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Principal / Headmaster, ${details.schoolName}`,
                size: 22,
                color: '374151'
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 100 },
            children: [
              new TextRun({
                text: '[ Official Institution Seal / Stamp Here ]',
                color: '9CA3AF',
                size: 18,
                italics: true
              })
            ]
          })
        ]
      }
    ]
  });
}

/**
 * Generates an official App Store / Play Store Publisher Authorisation Letter
 */
export function createPublisherAuthorisationDocx(details: SchoolDetailsForDocx): Document {
  return new Document({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: details.schoolName.toUpperCase(),
                bold: true,
                size: 30,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `${details.address} | Tel: ${details.phone}`,
                size: 18,
                color: '6B7280'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 240 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `Date: ${new Date().toLocaleDateString('en-IN')}`,
                bold: true,
                size: 20
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'AUTHORISATION LETTER FOR MOBILE APPLICATION PUBLISHING',
                bold: true,
                underline: {},
                size: 24
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `To: Google Play App Review Team / Apple App Review Board`,
                bold: true,
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `I, `,
                size: 22
              }),
              new TextRun({
                text: details.principalName,
                bold: true,
                size: 22
              }),
              new TextRun({
                text: `, holding the official position of Principal / Head of Institution at `,
                size: 22
              }),
              new TextRun({
                text: details.schoolName,
                bold: true,
                size: 22
              }),
              new TextRun({
                text: `, hereby authorize EduPortal Platform to develop, compile, sign, upload, and maintain the official mobile applications on our behalf in Google Play Store and Apple App Store.`,
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `The mobile applications will feature our school name, emblem, and official educational content for students, parents, and faculty members. EduPortal is authorised as our designated technical distributor.`,
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 400, after: 120 },
            children: [
              new TextRun({
                text: 'Authorized Signatory:',
                bold: true,
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 500 },
            children: [
              new TextRun({
                text: `${details.principalName}\nPrincipal, ${details.schoolName}`,
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 100 },
            children: [
              new TextRun({
                text: '[ Institutional Stamp ]',
                color: '9CA3AF',
                size: 18,
                italics: true
              })
            ]
          })
        ]
      }
    ]
  });
}

/**
 * Generates an ERNET / Registry Declaration for .edu.in or .ac.in
 */
export function createDomainDeclarationDocx(details: SchoolDetailsForDocx): Document {
  return new Document({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: details.schoolName.toUpperCase(),
                bold: true,
                size: 28,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'REGISTRANT UNDERTAKING & DECLARATION FOR .EDU.IN DOMAIN ALLOCATION',
                bold: true,
                underline: {},
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Requested Domain: ${details.requestedDomain || 'schoolname.edu.in'}`,
                bold: true,
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `We hereby declare that ${details.schoolName} is a bona fide educational institution recognized by ${details.boardAffiliation || 'State Board of School Education / CBSE / ICSE'}. We undertake that the domain will be used solely for institutional purposes.`,
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 400 },
            children: [
              new TextRun({
                text: `Signature: ___________________________\n${details.principalName}\nHead of Institution`,
                size: 22
              })
            ]
          })
        ]
      }
    ]
  });
}

/**
 * Downloads a generated docx Document in the browser as a .docx file.
 */
export async function downloadDocxInBrowser(doc: Document, fileName: string): Promise<void> {
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.docx') ? fileName : `${fileName}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
