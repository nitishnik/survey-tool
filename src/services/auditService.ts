/**
 * Audit Service - Tracks data access and changes for security and compliance
 * Mirrors localStorageService pattern for easy backend integration
 */

import { getStorageItem, setStorageItem } from '@/utils/storageUtil'

const AUDIT_STORAGE_KEY = 'survey_tool_audit_logs'

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  PUBLISH = 'publish',
  CLOSE = 'close',
  SCHEDULE = 'schedule',
  COMPLETE = 'complete',
  EXPORT = 'export',
}

export enum AuditEntity {
  SURVEY = 'survey',
  RESPONSE = 'response',
  WORKSHOP = 'workshop',
  TEMPLATE = 'template',
  USER = 'user',
}

export interface AuditLog {
  id: string
  userId: string
  userEmail?: string
  action: AuditAction
  entity: AuditEntity
  entityId: string
  entityName?: string
  changes?: Record<string, { old: any; new: any }>
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

interface AuditService {
  log(action: AuditAction, entity: AuditEntity, entityId: string, options?: {
    userId?: string
    userEmail?: string
    entityName?: string
    changes?: Record<string, { old: any; new: any }>
  }): void
  getLogs(entityId?: string, entity?: AuditEntity, userId?: string): AuditLog[]
  getLogsByDateRange(startDate: string, endDate: string): AuditLog[]
  clearLogs(): void
}

class AuditServiceImpl implements AuditService {
  private getAllLogs(): AuditLog[] {
    return getStorageItem<AuditLog[]>(AUDIT_STORAGE_KEY) || []
  }

  private saveLogs(logs: AuditLog[]): void {
    // Keep only last 1000 logs to prevent localStorage overflow
    const limitedLogs = logs.slice(-1000)
    setStorageItem(AUDIT_STORAGE_KEY, limitedLogs)
  }

  log(
    action: AuditAction,
    entity: AuditEntity,
    entityId: string,
    options: {
      userId?: string
      userEmail?: string
      entityName?: string
      changes?: Record<string, { old: any; new: any }>
    } = {}
  ): void {
    const logs = this.getAllLogs()
    const currentUser = getStorageItem<{ user: { id: string; email?: string } }>('survey_tool_auth')?.user

    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: options.userId || currentUser?.id || 'anonymous',
      userEmail: options.userEmail || currentUser?.email,
      action,
      entity,
      entityId,
      entityName: options.entityName,
      changes: options.changes,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    }

    logs.push(log)
    this.saveLogs(logs)
  }

  getLogs(entityId?: string, entity?: AuditEntity, userId?: string): AuditLog[] {
    let logs = this.getAllLogs()

    if (entityId) {
      logs = logs.filter((log) => log.entityId === entityId)
    }

    if (entity) {
      logs = logs.filter((log) => log.entity === entity)
    }

    if (userId) {
      logs = logs.filter((log) => log.userId === userId)
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  getLogsByDateRange(startDate: string, endDate: string): AuditLog[] {
    const logs = this.getAllLogs()
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()

    return logs
      .filter((log) => {
        const logTime = new Date(log.timestamp).getTime()
        return logTime >= start && logTime <= end
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  clearLogs(): void {
    setStorageItem(AUDIT_STORAGE_KEY, [])
  }
}

const auditService = new AuditServiceImpl()

export default auditService

