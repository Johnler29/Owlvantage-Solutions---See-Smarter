import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded-md",
        "[animation-duration:1.5s]",
        className
      )}
      style={{
        backgroundImage: "linear-gradient(90deg, var(--muted) 25%, var(--muted-foreground)/10 50%, var(--muted) 75%)",
        backgroundSize: "200% 100%",
      }}
      {...props}
    />
  );
}

export { Skeleton };
