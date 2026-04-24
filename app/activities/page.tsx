We need to produce the content for `app/activities/page.tsx`. The task is to build an activities feed page with global timeline, filters by type, contact, date range. Since this is a Next.js App Router page, we need to create it. But we don't have existing file content. The current file content is empty or the file may not exist. We'll create the file as a new file.

We need to follow the rules: return final file content only, no explanations, etc. Also, we must consider the unified design policy, use shadcn/ui, include loading/empty/error states, etc. The page should be a server component that fetches activities, with client-side filter controls. But for simplicity and to match typical patterns, we can have a client component or a server component with client-side interactivity. The task says "Build activities feed page", so we'll produce a complete page.

Given the context of a CRM, activities likely include calls, emails, meetings, notes, etc. We'll assume a Prisma model `Activity` with fields: id, type, title, description, date, contactId, dealId, createdAt. The page should fetch activities, display them in a timeline view, and allow filtering.

We'll use shadcn/ui components: Card, Button, Select, Input, etc. We'll also need to handle loading and empty states. Since we're creating a new file, we'll produce the full file content.

But note: The instruction says "Return only the requested code artifact for compile (unified diff or final file content)." For a new file, we should output the full file content. So we'll output the code for `app/activities/page.tsx`.

We need to make sure it's functional and follows conventions. We'll include:
- Import statements.
- Fetch activities from API (or directly from database using server actions/Prisma). Since the instruction mentions "server-side data fetching" in other tasks, we can use a server component that fetches data. But filters require client interaction: we can use search params or client-side filters. A common pattern is to have a client component that calls an API with filter params. Or we can use a server component with search params. For a timeline with filters, it's easier to have a client component that fetches from an API route. However, to minimize client-side complexity, we can use a page that reads search params and fetches data on the server, then passes to a client component for the timeline rendering. But the filters need client interaction to update the URL. We'll use a client component that manages filters and fetches via API. That's standard.

We'll create the page as a client component? Actually, we can make the page a server component that fetches initial data and passes to a client component that handles filtering. But for simplicity, we'll make the page a client component that uses useEffect to fetch data. However, the unified design policy prefers server components when possible. But for an interactive filter page, client component is fine.

Given the task is specifically for the file `app/activities/page.tsx`, we'll output the code.

We must also consider that the repository might have prisma schema, but we don't have it. We'll assume an endpoint `/api/activities` exists that supports query params `type`, `contactId`, `dateFrom`, `dateTo`. We'll use that.

We'll include:
- Filter controls: type dropdown, contact search/select, date range picker.
- Timeline display: list of activities with date, type badge, title, description, link to contact/deal.
- Loading state (skeleton).
- Empty state.
- Error handling.

We'll use shadcn/ui components: Select, Input, Button, Card, Skeleton, etc. We'll also use a date range picker (Calendar + Popover). But to keep it manageable, we can use two date inputs.

We'll also use toast for errors.

Since we're building a single file, we can include all logic within the page component. Alternatively, we could create subcomponents, but the task says one file per task, so we'll keep it in the page file.

Let's write the code. We'll assume the file path exists in the app router: `app/activities/page.tsx`.

We'll export a client component named `ActivitiesPage`. We'll use `useState`, `useEffect`, `useCallback`, etc.

We'll also include filter state.

We'll use `cn()` utility from `@/lib/utils`.

We'll need to make sure imports are correct.

We'll output the final file content.
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, FilterIcon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "note" | "task";
  title: string;
  description: string;
  date: string;
  contact?: { id: string; name: string };
  deal?: { id: string; title: string };
}

const activityTypeLabels: Record<string, string> = {
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  note: "Note",
  task: "Task",
};

const activityTypeColors: Record<string, string> = {
  call: "bg-blue-100 text-blue-800",
  email: "bg-green-100 text-green-800",
  meeting: "bg-purple-100 text-purple-800",
  note: "bg-yellow-100 text-yellow-800",
  task: "bg-orange-100 text-orange-800",
};

export default function ActivitiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");
  const [contactFilter, setContactFilter] = useState(searchParams.get("contact") || "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
      if (contactFilter) params.set("contact", contactFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/activities?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data = await res.json();
      setActivities(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [typeFilter, contactFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Update URL params when filters change
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
    if (contactFilter) params.set("contact", contactFilter);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setContactFilter("");
    setDateFrom("");
    setDateTo("");
    router.push(pathname);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
        <Button variant="outline" size="sm" onClick={fetchActivities}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1 block">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {Object.entries(activityTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1 block">Contact</label>
              <Input
                placeholder="Search contact..."
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1 block">From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1 block">To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={applyFilters}>
                <FilterIcon className="mr-2 h-4 w-4" />
                Apply
              </Button>
              <Button variant="ghost" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="py-4 text-destructive">
            {error}
            <Button variant="link" onClick={fetchActivities} className="ml-2">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && activities.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-2">No activities found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or create a new activity.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Activities timeline */}
      {!loading && !error && activities.length > 0 && (
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <Badge className={cn(activityTypeColors[activity.type])}>
                    {activityTypeLabels[activity.type] || activity.type}
                  </Badge>
                  <CardTitle className="text-base">{activity.title}</CardTitle>
                </div>
                <time className="text-sm text-muted-foreground">
                  {format(parseISO(activity.date), "MMM d, yyyy h:mm a")}
                </time>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                {(activity.contact || activity.deal) && (
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    {activity.contact && (
                      <span>
                        Contact:{" "}
                        <a href={`/contacts/${activity.contact.id}`} className="font-medium underline">
                          {activity.contact.name}
                        </a>
                      </span>
                    )}
                    {activity.deal && (
                      <span>
                        Deal:{" "}
                        <a href={`/deals/${activity.deal.id}`} className="font-medium underline">
                          {activity.deal.title}
                        </a>
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}