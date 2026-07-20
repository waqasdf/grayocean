import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[14px] font-medium tracking-[-0.01em] transition-[background,border-color,color,box-shadow,opacity] duration-[var(--go-duration-fast)] ease-[var(--go-ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--go-accent-border)] focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--go-accent)] text-white shadow-[var(--go-shadow-button)] hover:bg-[var(--go-accent-hover)] active:bg-[var(--go-accent-active)]",
        destructive:
          "bg-[var(--go-error)] text-white hover:brightness-110 active:brightness-95",
        outline:
          "border border-[color:var(--go-border-strong)] bg-transparent text-[color:var(--go-text)] hover:bg-[var(--go-bg-hover)]",
        secondary:
          "bg-[var(--go-bg-panel)] text-[color:var(--go-text)] border border-[color:var(--go-border)] hover:bg-[var(--go-bg-hover)]",
        ghost:
          "hover:bg-[var(--go-bg-hover)] text-[color:var(--go-text-secondary)] hover:text-[color:var(--go-text)]",
        link: "text-[color:var(--go-accent-text)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
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
