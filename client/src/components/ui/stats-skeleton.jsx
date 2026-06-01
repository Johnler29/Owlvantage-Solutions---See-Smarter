import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatsCardSkeleton({ className }) {
  return (
    <article className={cn("rounded-xl border border-gray-100 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* Label */}
          <Skeleton className="h-4 w-32 rounded-md mb-3" />
          {/* Value */}
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
        {/* Icon */}
        <Skeleton className="h-11 w-11 rounded-xl" />
      </div>
    </article>
  );
}

export function StatsGridSkeleton({ count = 4, className }) {
  return (
    <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}
