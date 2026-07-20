---
name: add-workspace-page
description: Add or wire an authenticated GrayOcean workspace page. Use when creating a new app page under src/pages, registering routes in pages.config.js, or adding sidebar/nav entries in Layout.
---

# Add workspace page

## Checklist

- [ ] `src/pages/PageName.jsx` (default export)
- [ ] `src/pages.config.js` — import + `PAGES["PageName"]`
- [ ] Sidebar entry in `src/Layout.jsx` if needed
- [ ] Feature UI under `src/components/<feature>/` when reusable
- [ ] Style with `--go-*` / UI kit

## pages.config.js

Header comment says auto-generated — **ignore that**. In this repo, edit imports + `PAGES`. Only `mainPage` should stay a valid `PAGES` key.

```js
import PageName from './pages/PageName';

export const PAGES = {
  // …
  "PageName": PageName,
}
```

## Skeleton

Copy a simple sibling (`Comparison.jsx` / `Forum.jsx`):

```jsx
export default function PageName() {
  return <div>{/* body */}</div>;
}
```

`Layout` already wraps auth pages — don't nest another shell.

## Not this skill

Public marketing URL → `add-marketing-page` (`src/pages/site/` + `App.jsx`), not `pages.config.js`.
