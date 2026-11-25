import { deepMerge, getUsersMe, getUsersMeMeta, updateMeProfile } from '@thunderid/browser'

const ICON_PENCIL = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`

// Attributes that are always read-only regardless of schema mutability
const ALWAYS_READONLY_KEYS = [
  'attributes',
  'id',
  'isReadOnly',
  'isReadonly',
  'ouId',
  'sub',
  'username',
  'userName',
  'user_name',
]

export function escapeHtml(str) {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatLabel(key) {
  return key
    .split(/(?=[A-Z])|[_.]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function fieldLabel(key, schemaEntry) {
  return schemaEntry?.displayName || formatLabel(key)
}

function isFieldEditable(key, schemaEntry) {
  if (ALWAYS_READONLY_KEYS.includes(key)) return false
  if (!schemaEntry) return false
  if (schemaEntry.credential) return false
  if (schemaEntry.readOnly || schemaEntry.mutability === 'READ_ONLY') return false
  return true
}

function getAvatarUrl(user) {
  return user?.profile || user?.profileUrl || user?.picture || user?.URL || null
}

// Deterministic gradient background derived from a name, matching `@thunderid/react`'s
// `Avatar` `background="random"` (default) behavior — same hash and HSL formula, so a
// given user gets the same avatar color here as they would in the React/Vue quickstarts.
function generateAvatarBackground(name) {
  const hash = name.split('').reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff, 0)
  const seed = Math.abs(hash)
  const hue1 = seed % 360
  const hue2 = (hue1 + 60 + (seed % 120)) % 360
  const saturation = 70 + (seed % 20)
  const lightness1 = 55 + (seed % 15)
  const lightness2 = 60 + (seed % 15)
  const angle = 45 + (seed % 91)
  return `linear-gradient(${angle}deg, hsl(${hue1}, ${saturation}%, ${lightness1}%), hsl(${hue2}, ${saturation}%, ${lightness2}%))`
}

function getInitials(user) {
  const given = user?.given_name || ''
  const family = user?.family_name || ''
  if (given && family) return (given[0] + family[0]).toUpperCase()
  const name = user?.name || user?.username || user?.email || '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

// `getDisplayName`: first + last name, falling back to
// username, email, then the `name` attribute.
function getDisplayName(user, attributes) {
  const given = attributes?.given_name || user?.given_name
  const family = attributes?.family_name || user?.family_name
  if (given && family) return `${given} ${family}`
  return user?.username || user?.email || attributes?.name || 'User'
}

function renderAvatarInner(user, displayName) {
  const avatarUrl = getAvatarUrl(user)
  if (avatarUrl) {
    return { className: '', html: `<img src="${escapeHtml(avatarUrl)}" alt="" />` }
  }
  return {
    className: 'has-gradient',
    html: escapeHtml(getInitials(user)),
    style: `background:${generateAvatarBackground(displayName || 'User')}`,
  }
}

export function createFetcher(auth) {
  return async (url, config) => {
    const token = await auth.getAccessToken()
    return fetch(url, {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${token}` },
    })
  }
}

// Fetches the schema and the current attribute values needed to render and validate the profile view.
export async function fetchProfileFormContext({ baseUrl, auth }) {
  const fetcher = createFetcher(auth)

  // A failed fetch stays `null`, not `{}` — `supportsCredential` treats those differently: an
  // unresolved schema is "not known yet" (every credential stays available), while `{}` is a
  // known schema declaring nothing (every credential becomes unavailable). Collapsing a fetch
  // failure into `{}` would make a transient network error look identical to "no credentials
  // configured".
  const [metaRes, profile] = await Promise.all([
    getUsersMeMeta({ baseUrl, fetcher }).catch(() => null),
    getUsersMe({ baseUrl, fetcher }).catch(() => null),
  ])

  return { schema: metaRes?.schema ?? null, profile }
}

function renderFieldRow(key, schemaEntry, value) {
  if (schemaEntry?.credential) return ''

  const label = fieldLabel(key, schemaEntry)
  const editable = isFieldEditable(key, schemaEntry)
  const hasValue = value !== undefined && value !== null && value !== ''

  // BaseUserProfile `shouldShow`: an empty read-only field is hidden entirely rather than rendered as a dash.
  if (!hasValue && !editable) return ''

  const displayValue = hasValue ? escapeHtml(String(value)) : `Enter your ${label.toLowerCase()}`

  return `
    <div class="profile-field-row" data-field="${escapeHtml(key)}">
      <div class="profile-field-row-label">${escapeHtml(label)}</div>
      <div class="profile-field-row-display">
        <span class="profile-field-row-value${!hasValue ? ' placeholder' : ''}">${displayValue}</span>
        ${editable ? `<button type="button" class="profile-field-edit-btn" data-action="edit" aria-label="Edit ${escapeHtml(label)}">${ICON_PENCIL}</button>` : ''}
      </div>
    </div>`
}

// Renders the "Personal info" section: avatar/name summary plus the schema-driven,
// per-field editable rows. Used by the account page's Personal info tab.
export function renderProfileFields(user, { schema = {}, profile } = {}) {
  const attributes = profile?.attributes || {}
  const displayName = getDisplayName(user, attributes)
  const avatar = renderAvatarInner(user, displayName)
  const email = escapeHtml(user?.email || user?.username || '')

  // `schema` may be `null` (the meta fetch failed) — a default parameter only covers
  // `undefined`, not an explicit `null`, so this still needs its own fallback.
  const rows = Object.entries(schema || {})
    .map(([key, schemaEntry]) => renderFieldRow(key, schemaEntry, attributes[key]))
    .join('')

  return `
    <div class="profile-summary">
      <div class="profile-summary-avatar ${avatar.className}" style="${avatar.style || ''}">${avatar.html}</div>
      <div>
        <div class="profile-summary-name">${escapeHtml(displayName)}</div>
        ${email ? `<div class="profile-summary-subtitle">${email}</div>` : ''}
      </div>
    </div>
    <div class="profile-error" id="profile-error" hidden></div>
    <div class="profile-field-list" id="profile-field-list">${rows}</div>`
}

// Validates a field value against its schema entry (required + regex), matching
// BaseUserProfile `handleFieldSave`. Returns an error message, or
// `null` when valid.
function validateField(schemaEntry, label, value) {
  if (!schemaEntry) return null

  if (schemaEntry.required && !value) {
    return `${label} is required.`
  }

  if (schemaEntry.regex && value) {
    try {
      if (!new RegExp(schemaEntry.regex).test(value)) {
        return `${label} is not in a valid format.`
      }
    } catch {
      // Invalid regex on the schema itself — nothing to enforce client-side.
    }
  }

  return null
}

// Wires up inline per-field editing for the rows rendered by `renderProfileFields`. Safe to
// call once after that markup is in the DOM.
export function attachProfileFieldHandlers({ user, auth, schema, profile, onSaved }) {
  // `schema` may be `null` (the meta fetch failed) — a default parameter only covers
  // `undefined`, not an explicit `null`, so this still needs its own fallback.
  const resolvedSchema = schema || {}
  const errorEl = document.getElementById('profile-error')
  const fieldList = document.getElementById('profile-field-list')
  const baseUrl = import.meta.env.VITE_THUNDERID_BASE_URL
  const fetcher = createFetcher(auth)

  // Tracks the latest known attributes so successive per-field edits merge against
  // up-to-date values without refetching the whole profile on every save.
  let currentAttributes = { ...(profile?.attributes || {}) }

  const refreshHeader = () => {
    const mergedUser = { ...user, ...currentAttributes }
    const displayName = getDisplayName(mergedUser, currentAttributes)

    const avatarEl = document.querySelector('.profile-summary-avatar')
    if (avatarEl) {
      const avatar = renderAvatarInner(mergedUser, displayName)
      avatarEl.className = `profile-summary-avatar ${avatar.className}`
      avatarEl.setAttribute('style', avatar.style || '')
      avatarEl.innerHTML = avatar.html
    }

    const nameEl = document.querySelector('.profile-summary-name')
    if (nameEl) nameEl.textContent = displayName
  }

  const showError = (message) => {
    if (!errorEl) return
    errorEl.hidden = false
    errorEl.textContent = message
  }
  const clearError = () => {
    if (!errorEl) return
    errorEl.hidden = true
    errorEl.textContent = ''
  }

  const startEdit = (row, key, schemaEntry) => {
    const display = row.querySelector('.profile-field-row-display')
    if (!display) return
    const currentValue = currentAttributes[key] ?? ''

    display.innerHTML = `
      <input type="text" class="profile-field-row-input" value="${escapeHtml(currentValue)}" />
      <div class="profile-field-row-actions">
        <button type="button" class="profile-field-btn profile-field-btn--save" data-action="save">Save</button>
        <button type="button" class="profile-field-btn profile-field-btn--cancel" data-action="cancel">Cancel</button>
      </div>`

    const input = display.querySelector('input')
    input?.focus()

    const cancel = () => {
      row.outerHTML = renderFieldRow(key, schemaEntry, currentAttributes[key])
    }

    const save = async () => {
      const value = input?.value.trim() || ''
      const label = fieldLabel(key, schemaEntry)
      const fieldError = validateField(schemaEntry, label, value)
      if (fieldError) {
        showError(fieldError)
        return
      }
      clearError()

      const saveBtn = display.querySelector('[data-action="save"]')
      if (saveBtn) saveBtn.disabled = true

      try {
        const mergedAttributes = deepMerge(currentAttributes, { [key]: value })
        const updatedUser = await updateMeProfile({ baseUrl, payload: mergedAttributes, fetcher })

        currentAttributes = { ...currentAttributes, [key]: updatedUser?.[key] ?? value }
        row.outerHTML = renderFieldRow(key, schemaEntry, currentAttributes[key])
        refreshHeader()

        onSaved?.({ ...user, ...currentAttributes })
      } catch (err) {
        showError(err?.message || 'Failed to update profile. Please try again.')
        if (saveBtn) saveBtn.disabled = false
      }
    }

    display.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action
      if (action === 'save') save()
      if (action === 'cancel') cancel()
    })

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') save()
      if (e.key === 'Escape') cancel()
    })
  }

  fieldList?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-action="edit"]')
    if (!editBtn) return
    const row = editBtn.closest('.profile-field-row')
    const key = row?.dataset.field
    if (!row || !key) return
    startEdit(row, key, resolvedSchema[key])
  })
}
