We need to create the seed file for Prisma with sample data for contacts, leads, deals, and activities. The instruction says to create seed script at prisma/seed.ts. We must output only the file content. No explanations, no code fences. Let's write the seed script. It should include the Prisma client import, a main function that creates sample data, and handle the seed accordingly. We'll use async/await, and ensure we disconnect the client. Also include proper error handling. The schema likely has models: User, Contact, Lead, Deal, Activity. We'll create sample users (maybe 2), contacts (5), leads (5), deals (3), activities (10). But not too many. Keep it concise. Also use faker? likely not required. We can hardcode sample data. Also note that bcrypt might be needed for password hashing for users. We'll import bcrypt. Also we'll use the existing Prisma client from app/lib/db.ts? But the seed script is at prisma/seed.ts, so it's better to import PrismaClient directly. We'll create a new PrismaClient instance. Also add appropriate tags, statuses, stages. We'll follow typical CRM structure. We'll also use process.env.DATABASE_URL? Not needed. We'll use the default PrismaClient.

We'll produce the final file content.

Let's write it.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.activity.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const password = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@crm.com",
      name: "Admin User",
      password,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "user@crm.com",
      name: "Jane Doe",
      password,
      role: "USER",
    },
  });

  // Create contacts
  const contact1 = await prisma.contact.create({
    data: {
      name: "Acme Corp",
      email: "info@acmecorp.com",
      phone: "+1-555-0101",
      status: "active",
      tags: ["enterprise", "tech"],
      ownerId: admin.id,
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      name: "Globex Inc",
      email: "hello@globex.com",
      phone: "+1-555-0102",
      status: "active",
      tags: ["startup", "saas"],
      ownerId: admin.id,
    },
  });

  const contact3 = await prisma.contact.create({
    data: {
      name: "Initech",
      email: "support@initech.com",
      phone: "+1-555-0103",
      status: "inactive",
      tags: ["enterprise"],
      ownerId: user.id,
    },
  });

  const contact4 = await prisma.contact.create({
    data: {
      name: "Hooli",
      email: "contact@hooli.com",
      phone: "+1-555-0104",
      status: "lead",
      tags: ["tech", "potential"],
      ownerId: user.id,
    },
  });

  const contact5 = await prisma.contact.create({
    data: {
      name: "Stark Industries",
      email: "info@starkindustries.com",
      phone: "+1-555-0105",
      status: "active",
      tags: ["manufacturing", "defense"],
      ownerId: admin.id,
    },
  });

  // Create leads
  const lead1 = await prisma.lead.create({
    data: {
      name: "Wayne Enterprises",
      email: "bruce@wayne.com",
      phone: "+1-555-0201",
      status: "new",
      source: "website",
      notes: "Interested in enterprise plan",
      ownerId: admin.id,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      name: "Oscorp",
      email: "norman@oscorp.com",
      phone: "+1-555-0202",
      status: "contacted",
      source: "referral",
      notes: "Met at tech conference",
      ownerId: user.id,
    },
  });

  const lead3 = await prisma.lead.create({
    data: {
      name: "LexCorp",
      email: "lex@lexcorp.com",
      phone: "+1-555-0203",
      status: "qualified",
      source: "cold call",
      notes: "Needs demo",
      ownerId: admin.id,
    },
  });

  const lead4 = await prisma.lead.create({
    data: {
      name: "Umbrella Corp",
      email: "info@umbrella.com",
      phone: "+1-555-0204",
      status: "lost",
      source: "partner",
      notes: "Chose competitor",
      ownerId: user.id,
    },
  });

  const lead5 = await prisma.lead.create({
    data: {
      name: "Cyberdyne Systems",
      email: "admin@cyberdyne.com",
      phone: "+1-555-0205",
      status: "new",
      source: "ad campaign",
      notes: "Requested pricing",
      ownerId: admin.id,
    },
  });

  // Create deals
  const deal1 = await prisma.deal.create({
    data: {
      title: "Acme Corp - Enterprise License",
      value: 50000,
      stage: "proposal",
      probability: 60,
      closeDate: new Date("2025-06-30"),
      contactId: contact1.id,
      ownerId: admin.id,
      notes: "Negotiating annual contract",
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      title: "Globex Inc - SaaS Subscription",
      value: 12000,
      stage: "negotiation",
      probability: 80,
      closeDate: new Date("2025-05-15"),
      contactId: contact2.id,
      ownerId: admin.id,
      notes: "Almost closed, final terms",
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      title: "Stark Industries - Consulting",
      value: 75000,
      stage: "discovery",
      probability: 30,
      closeDate: new Date("2025-08-01"),
      contactId: contact5.id,
      ownerId: user.id,
      notes: "Initial meetings ongoing",
    },
  });

  // Create activities
  await prisma.activity.createMany({
    data: [
      {
        type: "note",
        subject: "Initial call with Acme Corp",
        description: "Discussed requirements, interested in API integration.",
        contactId: contact1.id,
        dealId: deal1.id,
        ownerId: admin.id,
      },
      {
        type: "email",
        subject: "Follow-up email to Globex Inc",
        description: "Sent pricing details and case studies.",
        contactId: contact2.id,
        dealId: deal2.id,
        ownerId: admin.id,
      },
      {
        type: "meeting",
        subject: "Demo with LexCorp",
        description: "Live demo of product, positive feedback.",
        leadId: lead3.id,
        ownerId: admin.id,
      },
      {
        type: "call",
        subject: "Call with Wayne Enterprises",
        description: "Left voicemail, will call back next week.",
        leadId: lead1.id,
        ownerId: admin.id,
      },
      {
        type: "note",
        subject: "Internal review",
        description: "Decided to move deal to proposal stage.",
        dealId: deal1.id,
        ownerId: admin.id,
      },
      {
        type: "email",
        subject: "Campaign response",
        description: "Cyberdyne Systems filled out contact form.",
        leadId: lead5.id,
        ownerId: admin.id,
      },
      {
        type: "meeting",
        subject: "Stark Industries kickoff",
        description: "Met with engineering team, scoped project.",
        contactId: contact5.id,
        dealId: deal3.id,
        ownerId: user.id,
      },
      {
        type: "note",
        subject: "Lost deal analysis",
        description: "Umbrella Corp chose competitor due to price.",
        leadId: lead4.id,
        ownerId: user.id,
      },
      {
        type: "call",
        subject: "Check-in with Oscorp",
        description: "Scheduled follow-up demo for next month.",
        leadId: lead2.id,
        ownerId: user.id,
      },
      {
        type: "note",
        subject: "Contact update",
        description: "Updated Initech status to inactive per request.",
        contactId: contact3.id,
        ownerId: user.id,
      },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });