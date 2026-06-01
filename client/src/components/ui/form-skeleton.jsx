import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function FormFieldSkeleton({ className }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-5 w-24 rounded-md" />
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}

export function FormSkeleton({ fields = 4, className }) {
  return (
    <div className={cn("space-y-5", className)}>
      {/* Header */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-5 w-96 rounded-md" />
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: fields }).map((_, i) => (
          <FormFieldSkeleton key={i} />
        ))}
      </div>

      {/* Textarea */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>

      {/* Submit button */}
      <Skeleton className="h-11 w-full rounded-md" />
    </div>
  );
}

export function ModalFormSkeleton({ className }) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Info block */}
      <div className="rounded-lg border border-[#25badf]/20 bg-[#25badf]/10 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Skeleton className="h-4 w-24 rounded-md mb-1" />
            <Skeleton className="h-5 w-full rounded-md" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 rounded-md mb-1" />
            <Skeleton className="h-5 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Form fields */}
      <FormSkeleton fields={4} />
    </div>
  );
}
