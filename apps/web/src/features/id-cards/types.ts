export type CardType = 'student' | 'staff';
export type CardLayout = 'vertical' | 'horizontal';
export type CardStatus = 'active' | 'expired' | 'lost' | 'revoked';

export interface IDCardTemplate {
  id: string;
  name: string;
  cardType: CardType;
  layout: CardLayout;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  showBloodGroup: boolean;
  showGuardianPhone: boolean;
  showAddress: boolean;
  showEmergencyContact: boolean;
  showBarcode: boolean;
  showQr: boolean;
  isDefault: boolean;
}

export interface IssuedIDCard {
  id: string;
  tenantId: string;
  cardNumber: string;
  cardType: CardType;
  personId: string;
  personName: string;
  identifier: string; // admission_no or employee_id
  roleOrClass: string; // "Class X-A" or "Senior PGT Mathematics"
  photoUrl?: string;
  dob?: string;
  bloodGroup?: string;
  phone?: string;
  guardianName?: string;
  address?: string;
  issueDate: string;
  expiryDate: string;
  qrVerificationToken: string;
  status: CardStatus;
  reprintCount: number;
  lastPrintedAt?: string;
}

export interface MissingDataAuditItem {
  id: string;
  name: string;
  identifier: string;
  type: CardType;
  missingFields: string[];
}
