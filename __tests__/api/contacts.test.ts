We need to produce the content for the file __tests__/api/contacts.test.ts with unit tests for contacts API routes using Vitest, covering CRUD and auth checks. The file does not exist yet, so we must create it. The test should import necessary modules, mock dependencies, and test GET, POST, PUT, DELETE endpoints with auth. Since we are using Next.js App Router with Prisma and NextAuth, we need to mock Prisma client and session. Use Vitest and test utilities. The file path is __tests__/api/contacts.test.ts. We'll write a comprehensive test file.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/contacts/route';
import { PUT, DELETE } from '@/app/api/contacts/[id]/route';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';

vi.mock('@/app/lib/db', () => ({
  prisma: {
    contact: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    activity: {
      create: vi.fn(),
    },
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

const mockSession = {
  user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
  expires: '2025-12-31T23:59:59Z',
};

const mockContact = {
  id: 'contact-1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  company: 'Acme Inc',
  status: 'active',
  tags: ['customer'],
  notes: null,
  ownerId: 'user-1',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const mockRequestInit = (body?: unknown, method = 'POST'): Request => {
  return {
    method,
    json: () => Promise.resolve(body),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  } as unknown as Request;
};

describe('Contacts API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
  });

  describe('GET /api/contacts', () => {
    it('should return a list of contacts for authenticated user', async () => {
      vi.mocked(prisma.contact.findMany).mockResolvedValue([mockContact]);
      vi.mocked(prisma.contact.count).mockResolvedValue(1);

      const request = new Request('http://localhost:3000/api/contacts?page=1&limit=10');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.contacts).toHaveLength(1);
      expect(data.total).toBe(1);
      expect(prisma.contact.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
          orderBy: { createdAt: 'desc' },
        })
      );
    });

    it('should return 401 if not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const request = new Request('http://localhost:3000/api/contacts');
      const response = await GET(request);
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/contacts', () => {
    it('should create a new contact', async () => {
      const newContactData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        company: 'Beta Corp',
        status: 'lead',
      };
      const createdContact = { ...mockContact, ...newContactData, id: 'contact-2' };
      vi.mocked(prisma.contact.create).mockResolvedValue(createdContact);

      const request = mockRequestInit(newContactData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.contact.name).toBe('Jane Smith');
      expect(prisma.contact.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...newContactData,
          ownerId: 'user-1',
        }),
      });
    });

    it('should return 400 for missing required fields', async () => {
      const request = mockRequestInit({});
      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should return 401 if not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const request = mockRequestInit({ name: 'Test' });
      const response = await POST(request);
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/contacts/[id]', () => {
    it('should update a contact', async () => {
      const updateData = { name: 'John Updated' };
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(mockContact);
      vi.mocked(prisma.contact.update).mockResolvedValue({ ...mockContact, ...updateData });

      const request = mockRequestInit(updateData, 'PUT');
      const response = await PUT(request, { params: { id: 'contact-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.contact.name).toBe('John Updated');
      expect(prisma.contact.update).toHaveBeenCalledWith({
        where: { id: 'contact-1' },
        data: updateData,
      });
    });

    it('should return 404 if contact not found', async () => {
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      const request = mockRequestInit({ name: 'Test' }, 'PUT');
      const response = await PUT(request, { params: { id: 'nonexistent' } });
      expect(response.status).toBe(404);
    });

    it('should return 403 if not owner', async () => {
      const otherContact = { ...mockContact, ownerId: 'other-user' };
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(otherContact);
      const request = mockRequestInit({ name: 'Test' }, 'PUT');
      const response = await PUT(request, { params: { id: 'contact-1' } });
      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/contacts/[id]', () => {
    it('should delete a contact', async () => {
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(mockContact);
      vi.mocked(prisma.contact.delete).mockResolvedValue(mockContact);

      const request = new Request('http://localhost:3000/api/contacts/contact-1', { method: 'DELETE' });
      const response = await DELETE(request, { params: { id: 'contact-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Contact deleted');
      expect(prisma.contact.delete).toHaveBeenCalledWith({
        where: { id: 'contact-1' },
      });
    });

    it('should return 404 if contact not found', async () => {
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      const request = new Request('http://localhost:3000/api/contacts/nonexistent', { method: 'DELETE' });
      const response = await DELETE(request, { params: { id: 'nonexistent' } });
      expect(response.status).toBe(404);
    });

    it('should return 403 if not owner', async () => {
      const otherContact = { ...mockContact, ownerId: 'other-user' };
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(otherContact);
      const request = new Request('http://localhost:3000/api/contacts/contact-1', { method: 'DELETE' });
      const response = await DELETE(request, { params: { id: 'contact-1' } });
      expect(response.status).toBe(403);
    });
  });
});