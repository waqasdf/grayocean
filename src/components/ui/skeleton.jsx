import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    (<div
      className={cn("go-skeleton-block", className)}
      {...props} />)
  );
}

export { Skeleton }
