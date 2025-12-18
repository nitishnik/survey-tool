import { AuditLog, AuditAction, AuditEntity } from '../models/AuditLog.model'
import { Request } from 'express'

export class AuditService {
  /**
   * Log an audit event
   */
  static async log(
    action: AuditAction,
    entity: AuditEntity,
    entityId: string,
    options: {
      userId?: string
      userEmail?: string
      entityName?: string
      changes?: Record<string, { old: any; new: any }>
      req?: Request
    } = {}
  ): Promise<void> {
    const auditLog = new AuditLog({
      userId: options.userId || 'anonymous',
      userEmail: options.userEmail,
      action,
      entity,
      entityId,
      entityName: options.entityName,
      changes: options.changes,
      timestamp: new Date(),
      ipAddress: options.req?.ip || options.req?.socket.remoteAddress,
      userAgent: options.req?.get('user-agent'),
    })

    await auditLog.save()
  }

  /**
   * Get audit logs with optional filters
   */
  static async getLogs(filters: {
    entityId?: string
    entity?: AuditEntity
    userId?: string
    startDate?: Date
    endDate?: Date
    limit?: number
  }): Promise<typeof AuditLog[]> {
    const query: any = {}

    if (filters.entityId) {
      query.entityId = filters.entityId
    }

    if (filters.entity) {
      query.entity = filters.entity
    }

    if (filters.userId) {
      query.userId = filters.userId
    }

    if (filters.startDate || filters.endDate) {
      query.timestamp = {}
      if (filters.startDate) {
        query.timestamp.$gte = filters.startDate
      }
      if (filters.endDate) {
        query.timestamp.$lte = filters.endDate
      }
    }

    const queryBuilder = AuditLog.find(query).sort({ timestamp: -1 })

    if (filters.limit) {
      queryBuilder.limit(filters.limit)
    }

    return queryBuilder.exec()
  }
}

