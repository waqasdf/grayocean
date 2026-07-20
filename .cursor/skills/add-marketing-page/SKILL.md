---
name: add-marketing-page
description: Add or wire a GrayOcean marketing/site page. Use when creating pages under src/pages/site, registering App.jsx routes, updating the site barrel, or MarketingShell nav.
---

# Add marketing page

## Checklist

- [ ] Create `src/pages/site/PageName.jsx` (default export)
- [ ] Export from `src/pages/site/index.js`
- [ ] Import + `<Route>` in `src/App.jsx`
- [ ] Nav link in `MarketingShell.jsx` if top-level
- [ ] Wrap with `MarketingShell` (unless auth/system page)
- [ ] Reuse `primitives.jsx` / `ProductPreview` where it fits
- [ ] `--go-*` tokens; match sibling page density

## Barrel

```js
// src/pages/site/index.js
export { default as PageName } from "./PageName";
```

## Route

Mirror an existing site route in `App.jsx` (path + element). Keep auth pages under `src/pages/site/auth/` and system pages under `system/`.

## Not this skill

Logged-in workspace tools → `add-workspace-page` (`pages.config.js` + `Layout.jsx`).
