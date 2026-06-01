import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TableSkeleton({ rows = 5, columns = 4, className }) {
  return (
    <div className={cn("w-full", className)}>
      {/* Table Header */}
      <div className="border-b border-gray-100 bg-slate-50 px-5 py-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24 rounded-md" />
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              "px-5 py-4 transition-colors duration-150",
              rowIndex % 2 === 0 ? "hover:bg-slate-50" : "bg-slate-50/30 hover:bg-slate-50"
            )}
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-full rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DataTableSkeleton({ className }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm", className)}>
      {/* Header section */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <Skeleton className="h-6 w-48 rounded-md mb-2" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <Skeleton className="h-10 w-full md:w-80 rounded-xl" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <TableSkeleton rows={5} columns={4} />
      </div>
    </div>
  );
}
