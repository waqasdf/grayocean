import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-[color:var(--go-input-border)] bg-[var(--go-input-bg)] px-3 py-2 text-[14px] text-[color:var(--go-input-text)] shadow-none transition-[border-color,box-shadow] duration-[var(--go-duration-fast)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[color:var(--go-placeholder)] hover:border-[color:var(--go-border-strong)] focus-visible:outline-none focus-visible:border-[color:var(--go-accent)] focus-visible:ring-[3px] focus-visible:ring-[color:rgba(94,106,210,0.28)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
