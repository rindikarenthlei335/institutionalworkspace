import { z } from 'zod';

export const ConnectCustomDomainSchema = z.object({
  hostname: z
    .string()
    .min(3, 'Hostname must be at least 3 characters')
    .max(253, 'Hostname too long')
    .regex(
      /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/,
      'Please enter a valid domain format (e.g. www.yourschool.com)'
    )
});

export type ConnectCustomDomainInput = z.infer<typeof ConnectCustomDomainSchema>;

export const RequestDomainSchema = z.object({
  desiredDomain: z
    .string()
    .min(3, 'Domain must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Domain name may only contain lowercase letters, numbers, and hyphens'),
  tld: z.enum(['.edu.in', '.ac.in', '.in', '.com', '.org.in']),
  schoolName: z.string().min(2, 'Official school name is required'),
  affiliationBoard: z.string().min(2, 'Affiliation / Board is required'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().min(10, 'Valid 10-digit phone number is required'),
  // Verification documents required based on TLD
  recognitionCertificate: z.string().min(1, 'Recognition certificate is required'),
  authorisationLetter: z.string().min(1, 'Authorisation letter is required'),
  addressProof: z.string().min(1, 'Address proof is required'),
  govtOrderDoc: z.string().optional() // Mandatory for .edu.in and .ac.in
});

export type RequestDomainInput = z.infer<typeof RequestDomainSchema>;
