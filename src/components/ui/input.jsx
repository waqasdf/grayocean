import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-[10px] border border-go-border bg-go-surface-elevated px-3 py-2 text-[14px] text-go-text shadow-none go-transition file:border-0 file:bg-transparent file:text-[13px] file:font-medium file:text-go-text placeholder:text-go-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
