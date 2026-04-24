We need to produce the final file content for app/api/contacts/route.ts based on the task instruction. The task says "update app/api/contacts/route.ts using unified diff." but the current file content is not provided; it's empty in the context. The user must have meant to provide the current file content but it's missing. The request is to "update" the file, but we don't have the existing content to diff against. However, the output contract says to return only the requested code artifact for compile (unified diff or final file content). Given that there is no current content, likely this is a new file creation. The instruction "update" could be interpreted as create if it doesn't exist. Since we are to produce final file content, I'll generate the full file content for a REST API route for contacts with GET and POST handlers, including search, filter, pagination, and auth check using NextAuth session. This aligns with the earlier plan step 18: "Build CRM REST API endpoints under app/api/contacts/: route.ts for GET (list, search, filter) and POST (create); [id]/route.ts for GET, PUT, DELETE." So we need the route.ts at app/api/contacts/route.ts.

I'll write a proper Next.js route handler using the App Router, with authentication via NextAuth, Prisma database client, and proper error handling. Use the shared db client from app/lib/db.ts and auth from app/lib/auth.ts. Include GET with search, status filter, pagination (page, limit query params) and POST to create a contact.

Also, since the task says "update", but no existing content, I'll produce the file as if it's new. The output should be the final file content.

I'll include proper TypeScript types and use NextResponse. I'll also consider that the plan uses shadcn/ui but that's for UI components, not API routes. Also note the preloaded skills about file conventions: API routes use route.ts or route.js. This is correct.

I'll also ensure we handle validation and error states.

Thus, final content:
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || undefined;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = (page - 1) * limit;

  try {
    const where: any = {
      userId: session.user.id,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = createContactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}