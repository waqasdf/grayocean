---
name: token-efficient
description: Minimize context and tool use while coding GrayOcean. Use at the start of large tasks, when exploring the repo, or when the user asks to save tokens / work efficiently.
---

# Token-efficient workflow

## Do

1. Grep for symbols (`export`, component name, `--go-`) before opening files
2. Read **one** sibling, then implement
3. Smallest possible diffs
4. Parallelize independent Grep/Glob/Read
5. Stop when the ask is done

## Don't

- Read all of `src/components/ui/`
- Dump `package.json` / lockfiles / full `index.css`
- Create AGENTS.md or extra markdown unless asked
- Run `npm run build` unless verifying your break
- Explore Base44 cloud docs — `localClient` is truth

## Quick map

| Task | Where |
|------|--------|
| Workspace page | `src/pages/X.jsx` + `pages.config.js` + `Layout.jsx` |
| Marketing page | `src/pages/site/` + barrel + `App.jsx` |
| Entity | `ENTITY_NAMES` + `src/entities/` + optional `base44/entities/` |
| Look | `--go-*` / `go-ui` skill |
