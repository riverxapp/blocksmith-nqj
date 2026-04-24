We need to create app/lib/filters.ts with functions to build Prisma where clauses from query params. The request is to add search and filter utilities. We'll create a module that exports functions like buildWhereClause that take a query object and return a Prisma where clause for models like Contact, Lead, Deal, Activity. Since it's a CRM, we need to handle common fields: search term across name/email, status filter, date range, etc. We'll write generic utility that can be used for different models.

We'll use a function that accepts allowed filter keys and search fields, then constructs a Prisma where object.

Since we are not given the exact Prisma schema, we'll assume typical fields: id, name, email, status, createdAt, etc. We'll make it flexible.

The file should export helpers like buildContactWhere, buildLeadWhere, buildDealWhere, buildActivityWhere, or a generic builder.

We'll produce final file content only.
import { Prisma } from "@prisma/client";

interface FilterParams {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
  [key: string]: string | undefined;
}

type SearchableFields = string[];

/**
 * Build a Prisma where clause for a given model from query parameters.
 * @param params - Query parameters object (search, status, from, to, plus custom keys).
 * @param searchFields - Fields to search against when `search` param is provided.
 * @param statusField - Name of the status field (default: 'status').
 * @param dateField - Name of the date field for range filtering (default: 'createdAt').
 * @returns Prisma where clause object.
 */
export function buildWhereClause<T = Prisma.InputJsonValue>(
  params: FilterParams,
  searchFields: SearchableFields = ["name", "email"],
  statusField: string = "status",
  dateField: string = "createdAt",
): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  // Full-text search across specified fields
  if (params.search) {
    where.OR = searchFields.map((field) => ({
      [field]: { contains: params.search, mode: "insensitive" },
    }));
  }

  // Status filter
  if (params.status) {
    where[statusField] = params.status;
  }

  // Date range filter
  if (params.from || params.to) {
    const dateFilter: Record<string, Date> = {};
    if (params.from) {
      dateFilter.gte = new Date(params.from);
    }
    if (params.to) {
      dateFilter.lte = new Date(params.to);
    }
    where[dateField] = dateFilter;
  }

  // Custom key-value filters (skip known keys)
  const knownKeys = new Set(["search", "status", "from", "to"]);
  for (const [key, value] of Object.entries(params)) {
    if (!knownKeys.has(key) && value !== undefined) {
      where[key] = value;
    }
  }

  return where;
}

/**
 * Build a Prisma where clause specifically for Contact model.
 */
export function buildContactWhere(params: FilterParams) {
  return buildWhereClause(params, ["name", "email", "company"]);
}

/**
 * Build a Prisma where clause specifically for Lead model.
 */
export function buildLeadWhere(params: FilterParams) {
  return buildWhereClause(params, ["name", "email", "source"]);
}

/**
 * Build a Prisma where clause specifically for Deal model.
 */
export function buildDealWhere(params: FilterParams) {
  return buildWhereClause(params, ["title", "description"], "stage", "createdAt");
}

/**
 * Build a Prisma where clause specifically for Activity model.
 */
export function buildActivityWhere(params: FilterParams) {
  return buildWhereClause(
    params,
    ["type", "notes"],
    "type",
    "createdAt",
  );
}