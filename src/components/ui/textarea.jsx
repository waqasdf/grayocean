import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-[10px] border border-go-border bg-go-surface-elevated px-3 py-2.5 text-[14px] text-go-text shadow-none go-transition placeholder:text-go-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
