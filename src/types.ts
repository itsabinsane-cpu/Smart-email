export type Page = 'home' | 'generate' | 'saved' | 'about' | 'settings';

export interface EmailGenerationRequest {
  emailType: string;
  recipientName: string;
  recipientEmail?: string;
  subjectPurpose: string;
  tone: string;
  additionalDetails?: string;
}

export interface GeneratedEmail {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
  fullText: string;
}

export interface SavedEmail {
  id: string;
  uid?: string;
  subject: string;
  recipient: string;
  recipientEmail?: string;
  emailType: string;
  tone: string;
  greeting?: string;
  emailBody: string;
  closing?: string;
  fullEmailText: string;
  dateCreated: string; // e.g. "Oct 24, 2024" or ISO string
  createdAtTimestamp: number;
}

export interface UserSettings {
  defaultTone: string;
  defaultSignature: string;
  darkMode: boolean;
}
