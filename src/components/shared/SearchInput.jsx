import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

/**
 * Search field with leading icon. Forwards all input props / refs.
 */
export const SearchInput = React.forwardRef(
  ({ className, inputClassName, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", className)}>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-go-text-muted"
          aria-hidden
        />
        <Input
          ref={ref}
          type="search"
          className={cn("pl-9", inputClassName)}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"
