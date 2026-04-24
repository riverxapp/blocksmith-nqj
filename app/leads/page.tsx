We need to compile the file `app/leads/page.tsx` based on the task instruction: "Build leads list page at `app/leads/page.tsx` with filtering by status (new, contacted, qualified, lost), data table, and bulk actions." The user is building an internal CRM app using Next.js with shadcn/ui. The file doesn't exist yet, so we need to create it.

We must follow the unified plan instructions and design policy for nextjs. Use shadcn/ui components, include data table, filtering, bulk actions, and proper states (loading, empty, error). Use server-side data fetching? The task says "with filtering by status", so likely client-side filtering or server-side? For simplicity, we'll use a client component with useState for filters and fetch data with useSWR or just useEffect. But best practice: use server component with search params? However bulk actions (select rows, delete, etc.) require client interactivity. So we'll create a client component that fetches leads from API.

We'll create a leads list page with:
- Search input? The task doesn't specify search, but we can include a search bar for better UX.
- Filter by status dropdown (new, contacted, qualified, lost).
- Data table with columns: name, email, status, created date.
- Checkbox selection for bulk actions: delete selected, change status (e.g., mark as contacted).
- Pagination.
- Loading skeleton, empty state, error state.

Make sure to import from @/components/ui/table, @/components/ui/button, @/components/ui/select, @/components/ui/input, @/components/ui/checkbox, @/components/data-table, etc. But we need to use existing components or create them? In the plan there are tasks for data-table component in Task 27, so we can use a shared data-table component. However, for this specific file, we can implement inline or use shared. Since the plan includes creating a shared data-table, we'll assume it's available. But to be safe, we'll use shadcn Table primitives directly and manage state ourselves.

We'll use the following imports:
- useQuery from @tanstack/react-query? Or simple fetch. We'll use a custom hook or just useState/useEffect. For simplicity, we'll use useState and fetch in useEffect. But we can also use Next.js server actions? For bulk actions, we need client-side interactivity.

We'll create a page component that is a client component (use client). It will fetch leads from /api/leads endpoint (which should exist from plan's Task 8). It will have state for leads, loading, error, selected IDs, filters.

We'll include filtering by status: new, contacted, qualified, lost. Use a select dropdown.

Bulk actions: delete selected, change status.

We'll also use a dialog for confirmation.

We'll include empty state, loading skeleton, and error state.

We'll use shadcn components: Table, Button, Select, Checkbox, Badge for status, Skeleton, Alert, Dialog.

We'll also use toast from sonner for success/error feedback.

Let's write the code. We'll keep it concise but complete.

Note: The file path is app/leads/page.tsx. We'll create the file content.

We need to ensure we don't output anything else but the file content.

We'll use proper TypeScript types.

Let's produce the final file.
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2, Trash2, RefreshCw } from "lucide-react";

const STATUS_OPTIONS = ["new", "contacted", "qualified", "lost"] as const;
type LeadStatus = (typeof STATUS_OPTIONS)[number];

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source?: string;
  notes?: string;
  createdAt: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<LeadStatus>("new");
  const [performingAction, setPerformingAction] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = statusFilter === "all" ? leads : leads.filter((l) => l.status === statusFilter);

  // Client-side search also (but we already pass search to API, so optionally keep for local filtering)
  const displayedLeads = searchQuery
    ? filteredLeads.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.company?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredLeads;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(displayedLeads.map((l) => l.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setPerformingAction(true);
    try {
      const res = await fetch("/api/leads/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      if (!res.ok) throw new Error("Failed to delete leads");
      toast.success("Leads deleted successfully");
      setSelectedIds(new Set());
      fetchLeads();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
    } finally {
      setPerformingAction(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleBulkStatusChange = async () => {
    if (selectedIds.size === 0) return;
    setPerformingAction(true);
    try {
      const res = await fetch("/api/leads/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds), status: bulkStatus }),
      });
      if (!res.ok) throw new Error("Failed to update leads");
      toast.success("Leads status updated");
      setSelectedIds(new Set());
      fetchLeads();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
    } finally {
      setPerformingAction(false);
      setChangeStatusDialogOpen(false);
    }
  };

  const statusBadgeVariant = (status: LeadStatus): "default" | "secondary" | "outline" | "destructive" | "success" => {
    switch (status) {
      case "new": return "default";
      case "contacted": return "secondary";
      case "qualified": return "success";
      case "lost": return "destructive";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error loading leads</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" className="ml-4" onClick={fetchLeads}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={() => router.push("/leads/new")}>Add Lead</Button>
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as LeadStatus | "all")}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Search by name, email, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {selectedIds.size > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedIds.size} selected
          </span>
          <Dialog open={changeStatusDialogOpen} onOpenChange={setChangeStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Change Status</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Status for {selectedIds.size} lead(s)</DialogTitle>
              </DialogHeader>
              <Select value={bulkStatus} onValueChange={(v) => setBulkStatus(v as LeadStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button variant="outline" onClick={() => setChangeStatusDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleBulkStatusChange} disabled={performingAction}>
                  {performingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete {selectedIds.size} lead(s)?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleBulkDelete} disabled={performingAction}>
                  {performingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {displayedLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-semibold">No leads found</p>
          <p className="text-sm text-muted-foreground">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters or search query."
              : "Get started by adding your first lead."}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === displayedLeads.length && displayedLeads.length > 0}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedLeads.map((lead) => (
                <TableRow key={lead.id} className={cn(selectedIds.has(lead.id) && "bg-muted/50")}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(lead.id)}
                      onCheckedChange={(checked) => handleSelectOne(lead.id, !!checked)}
                      aria-label={`Select ${lead.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(lead.status)} className="capitalize">
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/leads/${lead.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}