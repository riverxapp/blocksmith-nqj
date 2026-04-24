We are asked to compile the final file content for `app/deals/page.tsx` based on the provided task instruction: "Build deals pipeline page at `app/deals/page.tsx` with Kanban board or list view (toggle), drag-and-drop between stages (using @dnd-kit)."

The current file does not exist, so we need to create it. The task is to build a deals pipeline page. According to the context, we are to use shadcn/ui components, and the repo uses shadcn. Also note that we have existing imports like `@/components/ui/*` and `@/lib/utils`. We need to create a functional React component that includes a Kanban board with drag-and-drop using `@dnd-kit`, and a toggle to switch between Kanban and list view.

We should consider the dependencies: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, shadcn components such as `Button`, `Card`, `Badge`, `Dialog`, etc.

Also, we need to define the data model for a Deal. In the context, there is a Prisma schema likely with a Deal model. We'll assume typical fields: id, title, value, stage, contactId, createdAt, etc.

The page should be a server component that fetches deals data from the server. However, drag-and-drop interactivity requires client components, so we'll split into client and server parts.

We'll create a server component `app/deals/page.tsx` that fetches deals and passes them to a client component `DealsPipeline`.

The client component will contain the Kanban board using `@dnd-kit` and a list view toggle with shadcn `DataTable`.

We must ensure we use `@/components/ui/button`, `@/components/ui/card`, `@/components/ui/badge`, `@/components/ui/data-table`, `@/components/ui/dialog`, etc.

Given the task, we'll produce the final file content for `app/deals/page.tsx`.

But the output should be only the final file content. We'll write a TypeScript React component.

I'll include:
- Server component fetching deals.
- A client wrapper with `useState` for view toggle and selected deals.
- KanbanBoard client component with `DndContext`, `SortableContext`, etc.
- List view using shadcn DataTable.
- Drag-and-drop to update deal stage.
- Maybe a dialog for editing.

Given the extensive nature, this is a substantial file. I'll produce a reasonable implementation.

Also note the use of `@/lib/db` for Prisma, `@/lib/auth` for session, etc. But since we are only producing the page file, we'll assume the necessary imports exist.

Let's generate the file content.
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { KanbanColumn } from "@/components/deals/kanban-column";
import { DealCard } from "@/components/deals/deal-card";

const DEAL_STAGES = [
  { id: "lead", label: "Lead", color: "bg-blue-100 text-blue-800" },
  { id: "qualified", label: "Qualified", color: "bg-purple-100 text-purple-800" },
  { id: "proposal", label: "Proposal", color: "bg-yellow-100 text-yellow-800" },
  { id: "negotiation", label: "Negotiation", color: "bg-orange-100 text-orange-800" },
  { id: "closed-won", label: "Closed Won", color: "bg-green-100 text-green-800" },
  { id: "closed-lost", label: "Closed Lost", color: "bg-red-100 text-red-800" },
] as const;

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  contactName?: string;
  company?: string;
  createdAt: string;
}

async function fetchDeals(): Promise<Deal[]> {
  const res = await fetch("/api/deals");
  if (!res.ok) throw new Error("Failed to fetch deals");
  return res.json();
}

async function updateDealStage(dealId: string, stage: string): Promise<Deal> {
  const res = await fetch(`/api/deals/${dealId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage }),
  });
  if (!res.ok) throw new Error("Failed to update deal stage");
  return res.json();
}

export default function DealsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const queryClient = useQueryClient();

  const { data: deals, isLoading, error } = useQuery({
    queryKey: ["deals"],
    queryFn: fetchDeals,
  });

  const mutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      updateDealStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const deal = deals?.find((d) => d.id === event.active.id);
    setActiveDeal(deal ?? null);
  }, [deals]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDeal(null);
      if (!over) return;
      const overStage = over.data.current?.stage;
      if (overStage && active.id !== over.id) {
        mutation.mutate({ id: active.id as string, stage: overStage });
      }
    },
    [mutation]
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        <p>Failed to load deals. Please try again.</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["deals"] })}>
          Retry
        </Button>
      </div>
    );
  }

  const stageDeals = (stageId: string) =>
    deals?.filter((d) => d.stage === stageId) ?? [];

  if (view === "list") {
    const columns = [
      { accessorKey: "title", header: "Title" },
      { accessorKey: "value", header: "Value", cell: ({ row }) => `$${row.getValue("value")?.toLocaleString()}` },
      { accessorKey: "stage", header: "Stage", cell: ({ row }) => {
        const stage = DEAL_STAGES.find((s) => s.id === row.getValue("stage"));
        return <Badge className={stage?.color}>{stage?.label}</Badge>;
      }},
      { accessorKey: "contactName", header: "Contact" },
      { accessorKey: "company", header: "Company" },
      { accessorKey: "createdAt", header: "Created", cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy") },
    ];

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Deals Pipeline</h1>
          <div className="flex gap-2">
            <Button
              variant={view === "kanban" ? "default" : "outline"}
              onClick={() => setView("kanban")}
            >
              Kanban
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
            >
              List
            </Button>
          </div>
        </div>
        <DataTable columns={columns} data={deals ?? []} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Deals Pipeline</h1>
        <div className="flex gap-2">
          <Button
            variant={view === "kanban" ? "default" : "outline"}
            onClick={() => setView("kanban")}
          >
            Kanban
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
          >
            List
          </Button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {DEAL_STAGES.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className={stage.color}>{stage.label}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {stageDeals(stage.id).length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 min-h-[200px]">
                  <SortableContext
                    items={stageDeals(stage.id).map((d) => d.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {stageDeals(stage.id).map((deal) => (
                      <DealCard key={deal.id} deal={deal} stageId={stage.id} />
                    ))}
                  </SortableContext>
                  {stageDeals(stage.id).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No deals in this stage
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeDeal ? (
            <DealCard deal={activeDeal} stageId={activeDeal.stage} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}