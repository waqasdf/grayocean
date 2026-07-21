import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

  const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-[14px] font-medium go-transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary focus-visible:ring-offset-2 focus-visible:ring-offset-go-bg disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-go-primary text-white shadow-go-xs hover:bg-go-primary-hover",
        destructive:
          "bg-go-danger text-white shadow-go-xs hover:bg-go-danger/90",
        outline:
          "border border-go-border bg-go-surface text-go-text shadow-go-xs hover:bg-go-surface-elevated hover:border-go-border-strong",
        secondary:
          "bg-go-surface-elevated text-go-text border border-go-border hover:bg-white/[0.06]",
        ghost:
          "text-go-text-secondary hover:bg-white/[0.04] hover:text-go-text",
        link:
          "text-go-text underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 rounded-[8px] px-3 text-[13px]",
        lg: "h-12 px-5 text-[14px]",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
