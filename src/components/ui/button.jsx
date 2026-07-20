import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[14px] font-medium tracking-[-0.01em] transition-[background,transform,filter,box-shadow,border-color,color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(94,106,210,0.35)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--go-accent)] text-white shadow-[var(--go-shadow-btn)] hover:bg-[var(--go-accent-hover)] hover:scale-[1.02] hover:brightness-105",
        destructive:
          "bg-[var(--go-error)] text-white shadow-[0_4px_16px_rgba(235,87,87,0.3)] hover:brightness-110 hover:scale-[1.02]",
        outline:
          "border border-[color:var(--go-border-strong)] bg-transparent text-[color:var(--go-text)] hover:bg-[var(--go-bg-elevated)] hover:scale-[1.02]",
        secondary:
          "bg-[var(--go-bg-panel)] text-[color:var(--go-text)] border border-[color:var(--go-border)] hover:bg-[var(--go-bg-elevated)] hover:scale-[1.02]",
        ghost:
          "hover:bg-[var(--go-bg-elevated)] text-[color:var(--go-text-secondary)] hover:text-[color:var(--go-text)]",
        link: "text-[color:var(--go-accent-text)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2.5",
        sm: "h-8 rounded-lg px-3 text-[13px]",
        lg: "h-11 rounded-lg px-5 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
