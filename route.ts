We need to produce a plan for building an internal CRM app. The user request is "Build a internal CRM app". The context includes a lot of planning details and tasks. However, the output contract says: "Return only the requested code artifact for compile (unified diff or final file content)." and "Compile only for target file: route.ts". The task instruction is "Task 18: Build CRM REST API endpoints under `app/api/contacts/`: route.ts for GET (list, search, filter) and POST (create); [id]/route.ts for GET, PUT, DELETE." But the provided file is route.ts from app/api/contacts/? Actually, the current file content shown is a CRM route registry, not an API endpoint handler. That seems mismatched. Possibly the intention is to update the route.ts file to be the contacts API endpoint. The current file content is a route registry. I think the request is to compile the final content for the file `route.ts` (which would be under `app/api/contacts/route.ts`?). But the provided context shows "File path: route.ts" and the content is a CRM route registry. That might be the root-level route.ts? No, it's a general routes file. But the task says "Build CRM REST API endpoints under `app/api/contacts/`". That implies we need to create or update `app/api/contacts/route.ts` to handle GET and POST. The current content is not that. Possibly the user wants to update that file to be the API handler. Since the instruction says "Compile only for target file: route.ts", I need to produce the final content for `app/api/contacts/route.ts` as the API handler. However, the current file content shown is a routes registry, which might be a different file. But for the compile target, I'll assume the file path is `app/api/contacts/route.ts`. But the instruction says "File path: route.ts" - ambiguous. Given the context from the plan: "Task 8: Build CRM REST API endpoints under `app/api/contacts/`: route.ts for GET (list, search, filter) and POST (create); [id]/route.ts for GET, PUT, DELETE." So the target is `route.ts` under `app/api/contacts/`. The current file content is not that, but perhaps it's mistakenly shown. I need to output the final content for `app/api/contacts/route.ts` with the API handler. I'll produce a Next.js API route that uses Prisma for CRUD operations, with authentication checks, and includes search/filter via query parameters.

Given the recovery context: "attempt=1 error_code=DIFF_NOT_APPLICABLE file_path=route.ts failed_job_index=0 message=validateDiffApplies failed for job 0 after refetch". So previous diff attempt failed. Now I need to provide the final file content for a full file replacement. Since the output contract says "Return only the requested code artifact for compile (unified diff or final file content)." and "Do not include explanations...", I'll output the final content for `app/api/contacts/route.ts`.

I'll write the file content assuming Prisma is set up, auth is handled via NextAuth/Auth.js, and using session retrieval. I'll include GET (list with search and filter) and POST (create). Also include proper error handling. I'll use `@/lib/db` for Prisma client and `@/lib/auth` for auth options. I'll follow the repo's conventions (no imports for nonexistent components). Since the repo already has `app/layout.tsx` and `app/page.tsx` as provided, but not the api structure. I'll produce a complete route.ts file.

Let's write it.
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = (page - 1) * limit;

  const where: any = {};
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

  try {
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contact.count({ where }),
    ]);
    return NextResponse.json({
      data: contacts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, company, position, status, notes, tags } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || '',
        company: company || '',
        position: position || '',
        status: status || 'active',
        notes: notes || '',
        tags: tags || [],
        createdBy: session.user.id,
      },
    });
    return NextResponse.json(contact, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A contact with this email already exists' }, { status: 409 });
    }
    console.error('Failed to create contact:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}