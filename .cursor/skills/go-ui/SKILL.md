---
name: go-ui
description: Apply GrayOcean UI tokens, shadcn primitives, and theme-aware styling. Use when building or restyling UI, pages, buttons, panels, or anything visual with --go-* / Tailwind.
---

# GrayOcean UI

## Rules

1. Colors/surfaces/borders → `var(--go-*)` only
2. Components → `@/components/ui/*`
3. Icons → `lucide-react`
4. Class merge → `cn()` from `@/lib/utils`
5. Motion → only if the screen already uses Framer Motion; no decorative motion

## Cheat sheet

```
bg:     --go-bg | --go-bg-card | --go-bg-panel | --go-bg-elevated
text:   --go-text | --go-text-body | --go-text-secondary | --go-text-muted
accent: --go-accent | --go-accent-text | --go-accent-soft | --go-accent-border
border: --go-border | --go-border-strong
status: --go-success | --go-warning | --go-error (+ -fill / -border)
```

## Pattern

```jsx
<div
  className="rounded-[12px] border p-4"
  style={{
    background: "var(--go-bg-card)",
    borderColor: "var(--go-border)",
    color: "var(--go-text)",
    boxShadow: "var(--go-shadow-card)",
  }}
>
  <p style={{ color: "var(--go-text-secondary)" }}>Supporting copy</p>
</div>
```

Tailwind: `bg-[var(--go-bg-card)] text-[color:var(--go-text)] border-[color:var(--go-border)]`

Dark mode = `.dark` in `index.css` — don't fork light/dark trees. Prefer `<Button variant="outline|secondary|ghost">`. Need more tokens → read only the `:root` block in `index.css`.
