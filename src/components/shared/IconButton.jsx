import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * Icon-only button with accessible name. Uses Button variants.
 */
export const IconButton = React.forwardRef(
  (
    {
      className,
      label,
      "aria-label": ariaLabel,
      size = "icon",
      variant = "ghost",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        aria-label={ariaLabel ?? label}
        title={label}
        className={cn("text-go-text-secondary hover:text-go-text", className)}
        {...props}
      >
        {children}
      </Button>
    )
  }
)
IconButton.displayName = "IconButton"
