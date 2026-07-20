/**
 * Local stand-in for the Base44 SDK.
 * Uses localStorage for entities so the UI can run without Base44.
 * Swap this for your real SaaS API later.
 */

const STORAGE_PREFIX = 'grayocean_entity_'
const AUTH_KEY = 'grayocean_auth_user'

const DEV_USER = {
  id: 'local-dev-user',
  email: 'dev@grayocean.local',
  full_name: 'Local Developer',
  role: 'admin',
  subscription_status: 'active',
  plan_type: 'annual',
  subscription_expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  trial_ends: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  last_payment_date: new Date().toISOString(),
  nmi_customer_vault_id: '',
  nmi_subscription_id: '',
}

function readStore(name) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + name)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeStore(name, rows) {
  localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(rows))
}

function sortRows(rows, order) {
  if (!order) return rows
  const desc = order.startsWith('-')
  const key = desc ? order.slice(1) : order
  return [...rows].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (av === bv) return 0
    if (av == null) return 1
    if (bv == null) return -1
    if (av < bv) return desc ? 1 : -1
    return desc ? -1 : 1
  })
}

function createEntityStore(name) {
  return {
    async list(order, limit) {
      let rows = sortRows(readStore(name), order)
      if (typeof limit === 'number') rows = rows.slice(0, limit)
      return rows
    },
    async filter(query = {}, order, limit) {
      let rows = readStore(name).filter((row) =>
        Object.entries(query).every(([k, v]) => row[k] === v)
      )
      rows = sortRows(rows, order)
      if (typeof limit === 'number') rows = rows.slice(0, limit)
      return rows
    },
    async get(id) {
      return readStore(name).find((row) => row.id === id) ?? null
    },
    async create(data) {
      const rows = readStore(name)
      const row = {
        id: crypto.randomUUID(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        ...data,
      }
      rows.push(row)
      writeStore(name, rows)
      return row
    },
    async update(id, data) {
      const rows = readStore(name)
      const idx = rows.findIndex((row) => row.id === id)
      if (idx === -1) throw new Error(`${name} not found: ${id}`)
      rows[idx] = {
        ...rows[idx],
        ...data,
        id,
        updated_date: new Date().toISOString(),
      }
      writeStore(name, rows)
      return rows[idx]
    },
    async delete(id) {
      writeStore(
        name,
        readStore(name).filter((row) => row.id !== id)
      )
      return { success: true }
    },
  }
}

const ENTITY_NAMES = [
  'User',
  'SSNLookup',
  'Address',
  'AddressComparison',
  'BatchAnalysis',
  'ForumPost',
  'SSNPattern',
  'SavedAddress',
  'SavedSSN',
  'SkiptraceSearch',
]

const entities = Object.fromEntries(
  ENTITY_NAMES.map((name) => [name, createEntityStore(name)])
)

function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setStoredUser(user) {
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  else localStorage.removeItem(AUTH_KEY)
}

/* Local mode: always have a workspace user — no login gate for now. */
if (typeof window !== 'undefined' && !getStoredUser()) {
  setStoredUser(DEV_USER)
}

const auth = {
  async isAuthenticated() {
    return !!getStoredUser()
  },
  async me() {
    const user = getStoredUser()
    if (!user) {
      const err = new Error('Unauthorized')
      err.status = 401
      throw err
    }
    return user
  },
  async login({ email, password, full_name, company } = {}) {
    void password
    const next = {
      ...DEV_USER,
      id: getStoredUser()?.id || crypto.randomUUID(),
      email: email || DEV_USER.email,
      full_name: full_name || (email ? email.split('@')[0] : DEV_USER.full_name),
      company: company || '',
    }
    setStoredUser(next)
    return next
  },
  async logout(redirectUrl) {
    setStoredUser(null)
    if (redirectUrl && typeof window !== 'undefined') {
      window.location.href = redirectUrl
    }
  },
  async redirectToLogin() {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  },
  async updateMyUserData(data) {
    const current = getStoredUser() || DEV_USER
    const next = { ...current, ...data }
    setStoredUser(next)
    return next
  },
}

const integrations = {
  Core: {
    async UploadFile() {
      return { file_url: '' }
    },
    async InvokeLLM() {
      throw new Error(
        'LLM features need your own backend. Wire InvokeLLM to your SaaS API.'
      )
    },
  },
}

const appLogs = {
  async logUserInApp() {
    return { ok: true }
  },
}

export const db = {
  auth,
  entities,
  integrations,
  appLogs,
}

export const base44 = db
export default db
