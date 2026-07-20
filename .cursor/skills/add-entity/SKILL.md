---
name: add-entity
description: Add a localStorage-backed entity to GrayOcean (Base44-shaped API). Use when creating new data models, CRUD stores, src/entities wrappers, or base44/entities schema files.
---

# Add entity

## Checklist

- [ ] Name → `ENTITY_NAMES` in `src/api/localClient.js`
- [ ] `src/entities/EntityName.js` wrapper
- [ ] Optional `base44/entities/EntityName.jsonc`
- [ ] Consume via entity module (not raw localStorage)

## Wrapper

```js
import { db } from '@/api/localClient'

const store = db.entities.EntityName

export const EntityName = {
  ...store,
}

export default EntityName
```

Auth helpers → follow `src/entities/User.js`.

## API

```js
await EntityName.list('-created_date', 50)
await EntityName.filter({ user_id: id }, '-created_date')
await EntityName.create({ … })
await EntityName.update(id, { … })
await EntityName.delete(id)
```

Rows auto-get `id`, `created_date`, `updated_date`.

## Don't

- Second persistence layer
- Real cloud Base44 unless user asks to replace `localClient`
