import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function AvatarSkeleton({ className, size = "md" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <Skeleton className={cn("rounded-full", sizeClasses[size] || sizeClasses.md, className)} />
  );
}

export function UserRowSkeleton({ className }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <AvatarSkeleton />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-3 w-48 rounded-md" />
      </div>
    </div>
  );
}

export function ProfileSkeleton({ className }) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <AvatarSkeleton size="xl" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-48 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
      </div>
    </div>
  );
}
