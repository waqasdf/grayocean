import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/shared/IconButton"

/**
 * Copy-to-clipboard control. Presentational; caller supplies the string.
 */
export function CopyButton({ value, label = "Copy", className, onCopied }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    if (value == null || value === "") return
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(true)
      onCopied?.()
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard may be unavailable — stay silent */
    }
  }

  return (
    <IconButton
      type="button"
      label={copied ? "Copied" : label}
      size="icon-sm"
      variant="ghost"
      className={cn(className)}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="size-3.5 text-go-success" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
    </IconButton>
  )
}
