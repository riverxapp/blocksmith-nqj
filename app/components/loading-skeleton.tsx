We need to produce the file content for `app/components/loading-skeleton.tsx` based on the task instruction to create a shared loading skeleton component for table rows and detail pages. The component should be a reusable skeleton using shadcn/ui Skeleton component, likely with variations for table rows and detail pages. Since it's a shared component, we should export multiple skeleton variants: e.g., TableSkeleton (rows), DetailSkeleton (for detail page), CardSkeleton, etc. Use the `cn` utility from `@/lib/utils` for class merging. Also import Skeleton from `@/components/ui/skeleton`.

Given the context of a Next.js CRM app with shadcn/ui, we'll create a well-structured component. We'll include:
- TableSkeleton: renders a table with a given number of rows and columns.
- DetailSkeleton: renders a layout for a detail page (e.g., profile, edit).
- CardSkeleton: renders a card with lines.

We'll also export default TableSkeleton or a generic Skeleton component? The task says "shared loading skeleton component", so we can export multiple named exports.

We'll use the existing Skeleton component from `@/components/ui/skeleton`. Need to ensure it exists; if not, we can create it in the component content. But we'll assume it exists as per shadcn/ui standard.

We'll also use `cn` from `@/lib/utils` for merging classes.

Let's write the content accordingly.
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 4, className, ...props }: TableSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex space-x-2">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

interface DetailSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
}

export function DetailSkeleton({ lines = 6, className, ...props }: DetailSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Skeleton className="h-8 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4 w-full", i === lines - 1 && "w-2/3")} />
      ))}
    </div>
  )
}

export function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-2 rounded-lg border p-4", className)} {...props}>
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-10 w-1/4" />
    </div>
  )
}

export function MetricCardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-lg border p-4", className)} {...props}>
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-8 w-1/3 mb-2" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  )
}