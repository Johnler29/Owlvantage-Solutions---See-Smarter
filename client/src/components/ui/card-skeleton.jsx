import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CardSkeleton({ className }) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-7 shadow-sm", className)}>
      {/* Header with title and badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <Skeleton className="h-7 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Description */}
      <Skeleton className="h-16 w-full rounded-md mb-6" />

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      {/* Action button */}
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
}

export function EventCardSkeleton({ className }) {
  return (
    <div className={cn("rounded-2xl border-2 border-[#25badf]/20 bg-white shadow-md p-8", className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <Skeleton className="h-8 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Description */}
      <Skeleton className="h-20 w-full rounded-md mb-6" />

      {/* Info badges */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-7">
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>

      {/* Button */}
      <Skeleton className="h-11 w-40 rounded-md" />
    </div>
  );
}

export function SeminarListSkeleton({ className }) {
  return (
    <div className={cn("bg-white p-8 rounded-lg border-2 border-[#25badf]/20 shadow-sm", className)}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Date/time block */}
        <div className="p-5 rounded-lg">
          <Skeleton className="h-6 w-20 rounded-md mb-2" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>

        {/* Title and location */}
        <div className="md:col-span-2">
          <Skeleton className="h-7 w-3/4 rounded-md mb-2" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
        </div>

        {/* Button */}
        <div className="text-right">
          <Skeleton className="h-10 w-32 rounded-md ml-auto" />
        </div>
      </div>
    </div>
  );
}
