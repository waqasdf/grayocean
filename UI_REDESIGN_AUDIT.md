# Gray Ocean — UI Redesign Audit

**Phase:** 1 — Audit only (no implementation)  
**Date:** 2026-07-21  
**Scope:** Frontend presentation layer under `src/`  
**Redesign source of truth:** The product redesign brief previously stored in this file (enterprise B2B SaaS direction: light default, restrained blue, Linear/Stripe/Ramp-like clarity). That brief remains the visual north star for Phases 2–7. This document is the codebase audit only.

**Strict design constraint for later phases:** The result must not read as generic AI-generated SaaS UI (no glassmorphism, neon, pulse décor, gradient text, purple-on-dark chrome, oversized empty cards, or decorative glow).

---

## 1. Current UI architecture

### Stack

| Layer | Reality in this repo |
|-------|----------------------|
| Framework | React 18 + Vite (`src/main.jsx` → `src/App.jsx`) |
| Routing | `react-router-dom` via `src/pages.config.js` (auto-registered pages + `Layout`) |
| Styling | Tailwind 3 + `tailwindcss-animate` |
| Primitives | shadcn/Radix under `src/components/ui/**` (49 files) |
| Motion | `framer-motion` on SSN and several tool pages |
| Charts | `recharts` in address/batch components |
| Icons | `lucide-react` |
| Auth UI | `AuthProvider` in `src/lib/AuthContext.jsx`; Layout also calls `db.auth.me()` separately |

### Route map (`src/pages.config.js`)

| Route key | Path | Main? | In sidebar? |
|-----------|------|-------|-------------|
| `SSNLookup` | `/`, `/SSNLookup` | Yes (`mainPage`) | Yes |
| `AddressLookup` | `/AddressLookup` | | Yes (“Address Intel”) |
| `BatchAnalysis` | `/BatchAnalysis` | | Yes |
| `Comparison` | `/Comparison` | | Yes (“Compare”) |
| `Skiptrace` | `/Skiptrace` | | Yes |
| `Forum` | `/Forum` | | Yes |
| `API` | `/API` | | Yes (footer of sidebar, special-styled) |
| `Account` | `/Account` | | **No** |
| `Pricing` | `/Pricing` | | **No** |

`App.jsx` wraps every registered page in `Layout` when auth passes. `ProtectedRoute.jsx` exists but is **not wired** into the router.

### Deleted / absent surfaces (relevant context)

Git shows marketing (`src/pages/site/**`), auth pages (Login, Landing, etc.), `ThemeProvider`, `ThemeToggle`, and `src/entities/*` wrappers as deleted. Pages still import `@/entities/...` — build/runtime for those imports depends on Base44/Vite resolution, not local entity files. Marketing shell components are gone. The live product UI is the **authenticated workspace only**.

### CSS / Tailwind pattern

- Semantic shadcn HSL tokens exist in `src/index.css` (`:root` light + `.dark`).
- Tailwind maps those tokens (`background`, `primary`, `sidebar-*`, etc.).
- **Almost no page uses them.** UI is painted with arbitrary dark hexes and white-alpha borders.
- `.cursor/rules/ui-design-system.mdc` references `--go-*` tokens — **zero `--go-*` definitions exist** in the codebase.
- `darkMode: ["class"]` is configured, but **no runtime applies `.dark`** to `<html>` / `<body>`. `ThemeProvider` is deleted. `next-themes` remains only as a dependency used by unused `sonner.jsx`.

**Net architecture:** Custom dark shell + page-local glass overrides on top of unused light shadcn tokens.

---

## 2. Current application shell

**File:** `src/Layout.jsx` (~233 lines)

### Structure

```
┌──────────────┬─────────────────────────────┐
│ Sidebar      │ Header (52px)               │
│ 210 / 56px   │ title · TLO pill · avatar   │
│ (md+)        ├─────────────────────────────┤
│ Nav + API    │ <main> {children}           │
│ User footer  │                             │
└──────────────┴─────────────────────────────┘
+ AnnouncementBox (portal-style overlay)
```

### Concrete shell styling (today)

- App chrome: `bg-[#0f0f0f]`, sidebar/header `bg-[#0c0c0c]`, `border-white/[0.05]`
- Expanded sidebar `w-[210px]`; collapsed `w-[56px]` (brief asks ~240 / ~64)
- Nav items: `text-[11px]`, icons `15px`, active `bg-white/[0.08]`
- API link: blue-bordered special case (not a nav group)
- Header center: **pulsing** “TLO Lookup — Coming Soon” pill (`animate-pulse`) — redesign brief forbids decorative pulse
- User email in sidebar: `text-[9px]` (below brief’s minimum for readable text)
- Avatar: blue gradient circle (`from-blue-600 to-blue-800`)
- Mobile: custom overlay drawer (not `Sheet`), no focus trap / Escape / `aria-modal`
- Mobile drawer has logo + nav only — **no sign-in / user block**
- Collapsed nav uses native `title=` only (no Tooltip component)
- Header avatar is **not a link** to Account
- `pageTitleMap` omits Account and Pricing

### What the shell does not do (vs redesign brief)

- No Workspace / Community / Developers grouping
- No light surface / semantic tokens
- No Account in shell navigation
- No proper top-bar actions / breadcrumbs
- Content width / page padding left entirely to each page
- Duplicate branding: Layout wordmark + SSNLookup also renders large `GrayOceanWordmark`
- Independent `db.auth.me()` instead of shared `AuthContext` user

`src/components/ui/sidebar.jsx` (shadcn sidebar) is present and **unused**.

---

## 3. Existing reusable components

### Product / feature components

| Area | Path | Role |
|------|------|------|
| SSN workflow | `src/components/ssn/*` (14 files) | Input, verdict, breakdown, issuance, geo, risk, AI, deceased, generator, loading |
| Address | `src/components/address/*` (5) | Map, demographics, lender alert, save dialog, extra intel |
| Batch charts | `src/components/batch/*` (2) | Risk distribution, state pattern |
| Brand | `GrayOceanLogo.jsx` | `LogoMark` + shimmer uppercase wordmark |
| Overlay | `AnnouncementBox.jsx` | Fixed marketing-style announcement |
| Layout | `layout/Footer.jsx` | **Unused** |
| Auth UI | `UserNotRegisteredError.jsx`, `ProtectedRoute.jsx` | Error screen; ProtectedRoute dead |

### shadcn UI primitives (`src/components/ui/`)

Present and generally stock: `button`, `input`, `textarea`, `select`, `card`, `badge`, `table`, `dialog`, `alert-dialog`, `sheet`, `drawer`, `tabs`, `tooltip`, `dropdown-menu`, `popover`, `skeleton`, `toast`/`toaster`, `scroll-area`, `separator`, `progress`, `checkbox`, `switch`, `label`, `form`, `avatar`, `breadcrumb`, `sidebar`, etc.

**Adoption problem:** Pages wrap primitives then override with dark glass classes, or skip primitives and use raw `<button>` / `<div>` chrome.

### Parallel badge system

`minimal-badge.jsx` is the dominant status chip:

- Sizes include `text-[9px]` / `text-[10px]`
- Always `uppercase tracking-wider`
- Variants include purple/cyan (AI-dashboard palette)
- Competes with shadcn `badge.jsx` (used mainly on Comparison)

### Missing vs redesign brief (must create or standardize)

| Needed | Status |
|--------|--------|
| `PageHeader` | Missing — copy-pasted header blocks on 6+ pages |
| `SectionHeader` | Missing |
| `SearchInput` | Missing |
| `IconButton` | Missing |
| `DataPanel` | Missing — local `Section`/`Row` in Skiptrace; ad-hoc cards elsewhere |
| `StatusBadge` | Missing — use MinimalBadge / Badge today |
| `EmptyState` / `LoadingState` / `ErrorState` | Missing — inline per page |
| `DefinitionList` | Missing |
| `ResultsTable` | Missing — Comparison builds a custom `<table>` |
| `ConfidenceIndicator` / `SourceBadge` / `CopyButton` | Missing (API inlines copy) |
| Semantic tokens (`--go-*` or aligned CSS vars) | Missing |
| Shell-aligned Button/Input variants | Exist as shadcn but not tuned to brief |

---

## 4. Existing design tokens

### Defined today (`src/index.css`)

shadcn defaults only, e.g.:

- Light `:root`: white background, near-black foreground, gray muted, red destructive
- `.dark`: near-black surfaces (`0 0% 3.9%`), light foreground
- `--radius: 0.5rem`
- Sidebar token set for shadcn sidebar (unused by Layout)
- Extra: `.logo-shimmer` animated gradient text (wordmark)

### Not defined (required by redesign brief)

| Token / role | Brief value (example) | In repo? |
|--------------|----------------------|----------|
| App background | `#F6F7F9` | No |
| Surface / elevated | `#FFFFFF` / `#F9FAFB` | No (pages use `#0f0f0f`, `#141414`) |
| Text primary / secondary / muted | `#111827` / `#374151` / `#6B7280` | No as product tokens |
| Border / border-strong | `#E5E7EB` / `#D1D5DB` | No — `border-white/[0.05–0.10]` instead |
| Brand primary / hover | `#2563EB` / `#1D4ED8` | Partial via Tailwind `blue-*` ad hoc |
| Success / warning / danger / info | green/amber/red/sky hexes in brief | Ad hoc `green-400`, `amber-400`, etc. |
| Typography scale (24–28 / 16–18 / 14 / 13 / 12) | Specified | Not encoded; pages use 9–13px |
| Spacing system (4px) | Specified | Not encoded as tokens |
| Focus / shadow / transition tokens | Specified | Stock focus ring only; rarely visible on custom buttons |
| `--go-*` (per cursor rule) | Referenced in rule | **0 occurrences** |

### Hard-coded pattern volume (`src/` approximate)

| Pattern | Approx. matches |
|---------|----------------:|
| `border-white/` | ~193 |
| `text-[10px]` | ~120 |
| `bg-white/` | ~97 |
| `text-[11px]` | ~86 |
| `(from\|to\|via)-blue-` | ~83 |
| `bg-gradient` | ~59 |
| Arbitrary `#…` colors | ~47 |
| `uppercase tracking-widest` | ~34 |
| `backdrop-blur` | ~25 |
| `bg-[#0f0f0f]` | ~24 |
| `bg-[#141414]` | ~17 |
| `text-[9px]` | ~4 |
| `animate-pulse` | ~4 |
| `--go-` | **0** |

---

## 5. Existing inconsistencies

1. **Theme model:** Light tokens in CSS; permanent hard-coded dark UI in Layout + pages; no class-based theme switch.
2. **Surface palette:** `#0f0f0f` vs `#141414` vs `#0c0c0c` vs `hsl(0,0%,9%)` (Account/Pricing/Footer) vs `bg-white/[0.03]`.
3. **Page headers:** Tool pages share icon-tile + `text-[13px]` title + `text-[11px]` subtitle; SSNLookup uses centered wordmark hero; Account/Pricing use large **gradient titles** (`text-2xl`–`text-4xl`) — three visual languages.
4. **Navigation IA:** Flat list vs brief’s grouped IA; Account/Pricing orphaned; API special-cased; no “Soon” TLO as quiet nav item.
5. **Typography:** Essential copy at 9–11px (AIInsights body, LoadingStatus steps, Comparison table cells, MinimalBadge). Brief: never 9–10px for essential info; 11px only for exceptional metadata.
6. **Badges:** `Badge` vs `MinimalBadge` (uppercase micro labels).
7. **Buttons:** shadcn `Button` defaults vs raw `bg-blue-600` vs gradient CTAs (`blue`→`purple` common).
8. **Cards:** shadcn `Card` + heavy overrides vs plain `div` panels with `bg-[#141414]`.
9. **Radii:** `rounded-md` / `rounded-lg` / `rounded-xl` / `rounded-full` pills mixed without a system.
10. **Auth display:** Layout `db.auth`, Account `User.me()`, App `AuthContext` — three user surfaces.
11. **Fonts:** Brief allows Inter / system sans. `index.html` loads **no** Inter (or other) font — system stack only. Wordmark uses extreme tracking + shimmer (marketing, not ops UI).
12. **Double backgrounds:** Pages set `min-h-screen bg-[#0f0f0f]` inside Layout’s already full-height dark main → scroll/height quirks.
13. **Purple/cyan accent language:** Address scores, Batch icon tiles, RiskAnalysis bars, MinimalBadge purple/cyan — conflicts with brief’s “restrained blue, avoid purple AI look.”

---

## 6. Problems that must be fixed

### Critical (blocks coherent redesign)

1. **No product token layer** — cannot restyle consistently without introducing/consolidating semantic tokens and migrating off `#0f0f0f` / `border-white/`.
2. **Shell is dark “ops dashboard” chrome** — must become the light, grouped, dense SaaS shell from the brief before pages will look unified.
3. **Page-owned backgrounds and glass** — Layout-only changes will leave black islands and invisible borders on light canvas.
4. **Typography below readable professional density** — mass `text-[10px]`/`[11px]` + uppercase tracking.
5. **Decorative AI-SaaS motifs** — shimmer logo, pulse TLO pill, glass + blur, blue–purple gradients, gradient text on Account/Pricing.

### High (product clarity / a11y)

6. Account & Pricing unreachable from shell; header avatar not navigable.
7. Mobile drawer accessibility (focus, Escape, semantics).
8. Color-only status (risk/score grades) without text+icon pairing in places.
9. Inconsistent empty/loading/error presentation across pages.
10. SSNLookup double-brands and lacks the shared page-header pattern used elsewhere.

### Medium (consistency debt)

11. Duplicate page-header markup across Address, Batch, Skiptrace, Forum, API.
12. Duplicate area→state logic in SSNLookup and Comparison (logic preserve; presentation extract only if safe).
13. Unused Footer, unused shadcn Sidebar, unused Sonner+next-themes without ThemeProvider.
14. AnnouncementBox visual language may clash with sober shell (presentation only).

---

## 7. Components that should be created or standardized

### Phase 2 — tokens (foundation)

Centralize in `src/index.css` (+ Tailwind extend), prefer consolidating shadcn vars toward the brief’s light palette rather than inventing a second unused system. Introduce `--go-*` (or remap existing `--background` / `--card` / etc.) for:

Background, surface, surface-muted/elevated, border, border-strong, text-primary/secondary/muted, primary, primary-hover, success, warning, danger, info, focus ring, radius, shadows, transitions.

### Phase 3 — shared presentational components

Prioritize (presentation only; no new API calls):

1. **PageHeader** — title, description, optional actions (kills duplicated headers)
2. **SectionHeader**
3. **StatusBadge** — replace MinimalBadge’s 9px uppercase / purple variants with sober semantic statuses
4. **EmptyState / LoadingState / ErrorState**
5. **DataPanel** — bordered surface for grouped fields (not a card-per-field)
6. **DefinitionList** — label/value rows for SSN/Address results
7. **SearchInput** — labeled, 40–44px height, focus ring
8. **IconButton**
9. Tune existing **Button / Input / Select / Card / Tabs / Dialog / Table / Skeleton / Tooltip** to tokens (variants, heights 40px, radius 6–10px)
10. Optional later: ResultsTable, ConfidenceIndicator, SourceBadge, CopyButton

### Phase 4 — Layout

Rebuild `Layout.jsx` presentation to brief: ~240/64 sidebar, grouped nav, quiet TLO-as-soon item if kept, Account in user area, accessible mobile drawer, content padding rhythm, no pulse pill, no gradient avatar required.

---

## 8. Recommended implementation order

Matches the mandated execution sequence (do not skip):

| Step | Work | Validate |
|------|------|----------|
| 1 | This audit | — |
| 2 | Design tokens in `index.css` + `tailwind.config.js` (consolidate, don’t fork) | `npm run build`, `npm run lint` |
| 3 | Shared components (PageHeader, states, badges, tuned primitives) | build + lint; smoke one page with overrides still dark if needed |
| 4 | `Layout.jsx` shell only | build + lint + responsive shell review |
| 5 | **STOP** — manual shell review (desktop / laptop / tablet / mobile) | fix shell only |
| 6 | Redesign **SSNLookup only** (+ its `src/components/ssn/*` presentation) as reference | build + lint + responsive |
| 7 | Remaining pages one-by-one using SSNLookup + tokens as reference: Address → Batch → Comparison → Skiptrace → Forum → API → Account → Pricing | build + lint per page or small batch |

**Do not** redesign all pages in one pass. **Do not** change Base44 entities, auth flows, validations, or search calculations.

---

## 9. Responsive issues

| Issue | Where |
|-------|--------|
| Mobile drawer lacks dialog semantics / focus trap / Escape | `Layout.jsx` |
| Mobile drawer missing user/sign-in | `Layout.jsx` |
| `min-h-screen` pages inside scrollable `<main>` → excess height / double scroll feel | All major pages |
| Dense `lg:grid-cols-5` tool layouts (Batch, Skiptrace) become long stacks on mobile without shared vertical rhythm | Batch, Skiptrace |
| Comparison custom table relies on `overflow-x-auto` — OK if headers stay sticky later; currently dense 10–11px cells | Comparison |
| SSN results stack many full-width glass cards — tall mobile pages | `ssn/*` |
| Header shows wordmark on mobile while SSNLookup also brands in content | Layout + SSNLookup |
| Touch targets: sidebar collapse / menu icons are small (`w-3.5`–`w-4`) | Layout |
| No documented max-width strategy — some pages `max-w-2xl` (SSN), others full bleed | Mixed |

Breakpoints already used: `md:` (~768), `lg:` (~1024). Brief also calls out 320 / 1440 — verify overflow at those widths during shell and SSN phases.

---

## 10. Risks and potential regressions

| Risk | Why it matters |
|------|----------------|
| Token swap without stripping page hex/alpha | Light shell + dark page backgrounds = broken contrast |
| Restyling Layout while pages keep glass | Borders disappear or harshen on light surfaces |
| Touching SSNLookup handlers / entity creates | Project protection: UI-only; preserve lookup, risk, deceased, AI insight flows |
| Wiring Account into avatar | Safe as Link presentation; must not change `redirectToLogin` behavior |
| “Enabling” `ProtectedRoute` | Currently incompatible with AuthContext exports — **do not enable** during UI work |
| Entity import paths | `@/entities/*` files deleted from tree; UI edits near those imports must not “fix” imports into new APIs |
| Chart colors hardcoded in batch/address | Token pass won’t cascade into Recharts without deliberate chart restyle |
| Removing shimmer / pulse / AnnouncementBox | Visible product messaging change — keep behavior, restyle or relocate quietly per brief |
| Framer entrance animations | Brief: motion only for meaningful state — reduce, don’t break AnimatePresence result swaps |
| Type scale bump (10px → 13–14px) | Result pages will reflow; expect spacing adjustments, not logic changes |
| Build/lint gates | After each major stage run `npm run build` and `npm run lint` (`package.json` scripts) |

---

## 11. How the redesign document maps to the current codebase

The redesign brief (enterprise light SaaS; investigator workflow; no AI-generic chrome) maps as follows:

| Brief requirement | Current codebase | Phase to address |
|-------------------|------------------|------------------|
| Light default (`#F6F7F9` app bg, white surfaces) | Hard dark `#0f0f0f` / `#0c0c0c` everywhere | 2 + 4, then pages |
| Semantic tokens / no raw hex | shadcn HSL unused; hex + white-alpha dominant; `--go-*` absent | 2 |
| Typography ≥12px essential; Inter/system | 9–11px dense; no Inter load; shimmer wordmark | 2–3, then pages |
| Sidebar ~240/64, grouped nav, Account bottom | 210/56, flat nav, Account orphaned | 4 |
| Quiet TLO “Soon” nav item | Pulsing header pill | 4 |
| Top bar: title + actions + user menu | Weak 11px title + pulse pill + non-link avatar | 4 |
| Shared PageHeader / Empty / Status / DataPanel | Missing; copy-paste + MinimalBadge | 3 |
| Cards only for meaningful grouping | Card-per-block + glass everywhere | 3 + page phases |
| SSN: focused search → calm loading → verdict-first results | Centered marketing hero + gradient input + stacked glass modules | 6 (reference page) |
| Avoid glass / neon / pulse / gradient text / purple AI look | All present (backdrop-blur, pulse, gradients, purple/cyan badges) | Throughout, starting shell + SSN |
| Address / Batch / Compare / Skiptrace structures | Exist functionally; presentation is dark glass dashboard | After SSN reference |
| Pricing: don’t fake paid SaaS if free | Single Free card + gradient marketing title | Late page pass |
| Account: settings layout, not dark marketing cards | Gradient headline + glass cards; not in nav | Late page pass |
| WCAG focus, labels, reduced motion | Custom controls often lack strong focus; logo animates continuously | 2–4 |
| Preserve business logic | Entities, validation, risk math, Base44 calls must stay | All phases |

### Anti-AI-generated design checklist (carry into every later phase)

When implementing, reject patterns that currently dominate this repo and read as generic AI UI:

- Shimmer / gradient text logos
- Pulsing status dots for non-live states
- Glassmorphism (`backdrop-blur` + translucent white panels)
- Blue→purple decorative gradients on icons and CTAs
- Uppercase micro-labels with wide tracking as default chrome
- One rounded card per datapoint
- Fake “live” or marketing energy inside investigation workflows

Target instead: neutral surfaces, one restrained blue, definition lists and tables, subtle borders, compact professional density — closer to serious B2B tools than a dark “intelligence” demo.

---

## Appendix A — Per-page snapshot

| Page | ~Lines | Current visual character | Redesign priority |
|------|-------:|--------------------------|-------------------|
| `SSNLookup.jsx` | ~884 | Dark centered hero, wordmark, gradient input focus, stacked ssn modules | **P0 reference (Phase 6)** |
| `AddressLookup.jsx` | ~831 | Shared dark header, glass cards, purple/cyan score language, map | P1 after SSN |
| `Comparison.jsx` | ~505 | Shared header variant, custom table, heavy 11px type | P1 |
| `Skiptrace.jsx` | ~443 | Shared header, local Section/Row panels, dense forms | P1 |
| `BatchAnalysis.jsx` | ~328 | Shared header, dashed empty, `#141414` chart panels | P1 |
| `Forum.jsx` | ~307 | Shared header, emerald accents, pulse on count | P2 |
| `API.jsx` | ~204 | Shared header, endpoint cards, inline copy | P2 |
| `Account.jsx` | ~190 | Orphan route, gradient title, hsl dark bg | P2 |
| `Pricing.jsx` | ~85 | Orphan route, marketing Free card | P2 |

## Appendix B — Commands for later validation

```bash
npm run build
npm run lint
npm run typecheck
```

---

## Phase 1 status

**Complete.** No UI implementation performed in this phase. Next authorized step: Phase 2 — design system foundation (tokens only), then shared components, then `Layout.jsx`, then stop for manual shell review before touching SSNLookup.
