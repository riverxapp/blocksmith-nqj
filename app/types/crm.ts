We need to generate the file content for `app/types/crm.ts` with type definitions for CRM objects. The task says "add type definitions for CRM objects in app/types/crm.ts (Contact, Lead, Deal, Activity interfaces matching Prisma)". Since we are building a CRM, we need to define those interfaces likely matching a Prisma schema. Without the actual Prisma schema, we infer reasonable fields for a typical CRM: Contact (id, name, email, phone, company, etc.), Lead (id, name, email, status, source, etc.), Deal (id, title, value, stage, contactId, etc.), Activity (id, type, description, date, contactId, dealId, etc.). We'll also include an enum for status/stage. We'll use proper TypeScript types.

We should output only the file content.
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  avatar?: string;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  status: LeadStatus;
  notes?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DealStage =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: DealStage;
  contactId?: string;
  contact?: Contact;
  closeDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityType =
  | "call"
  | "email"
  | "meeting"
  | "note"
  | "task"
  | "other";

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  date: Date;
  completed: boolean;
  contactId?: string;
  contact?: Contact;
  dealId?: string;
  deal?: Deal;
  createdAt: Date;
  updatedAt: Date;
}