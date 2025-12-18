/**
 * localStorageService - Data persistence abstraction layer
 * Mirrors httpService pattern for easy backend integration later
 */

import { getStorageItem, setStorageItem } from '@/utils/storageUtil'

// Storage keys
const STORAGE_KEYS = {
  USERS: 'survey_tool_users',
  SURVEYS: 'survey_tool_surveys',
  RESPONSES: 'survey_tool_responses',
  WORKSHOPS: 'survey_tool_workshops',
  TEMPLATES: 'survey_tool_templates',
  AUTH: 'survey_tool_auth',
} as const

// Generic CRUD operations
class LocalStorageService {
  // Generic get all
  getAll<T>(key: keyof typeof STORAGE_KEYS): T[] {
    const data = getStorageItem<T[]>(STORAGE_KEYS[key])
    return data || []
  }

  // Generic get by id
  getById<T extends { id: string }>(
    key: keyof typeof STORAGE_KEYS,
    id: string
  ): T | null {
    const items = this.getAll<T>(key)
    return items.find((item) => item.id === id) || null
  }

  // Generic create
  create<T extends { id: string }>(
    key: keyof typeof STORAGE_KEYS,
    item: T
  ): T {
    const items = this.getAll<T>(key)
    items.push(item)
    setStorageItem(STORAGE_KEYS[key], items)
    return item
  }

  // Generic update
  update<T extends { id: string }>(
    key: keyof typeof STORAGE_KEYS,
    id: string,
    updates: Partial<T>
  ): T | null {
    const items = this.getAll<T>(key)
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) return null

    items[index] = { ...items[index], ...updates }
    setStorageItem(STORAGE_KEYS[key], items)
    return items[index]
  }

  // Generic delete
  delete(key: keyof typeof STORAGE_KEYS, id: string): boolean {
    const items = this.getAll<{ id: string }>(key)
    const filtered = items.filter((item) => item.id !== id)
    if (filtered.length === items.length) return false

    setStorageItem(STORAGE_KEYS[key], filtered)
    return true
  }

  // Generic query/filter
  query<T>(
    key: keyof typeof STORAGE_KEYS,
    predicate: (item: T) => boolean
  ): T[] {
    const items = this.getAll<T>(key)
    return items.filter(predicate)
  }
}

const localStorageService = new LocalStorageService()

export default localStorageService

