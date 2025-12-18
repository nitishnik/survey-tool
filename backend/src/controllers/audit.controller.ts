import { Response } from 'express'
import { AuditLog, AuditEntity } from '../models/AuditLog.model'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { AuditService } from '../services/audit.service'

/**
 * Get audit logs
 * GET /api/audit-logs
 */
export const getAuditLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const {
    entityId,
    entity,
    userId,
    startDate,
    endDate,
    limit,
  } = req.query

  const filters: {
    entityId?: string
    entity?: AuditEntity
    userId?: string
    startDate?: Date
    endDate?: Date
    limit?: number
  } = {}

  if (entityId) {
    filters.entityId = entityId as string
  }

  if (entity) {
    filters.entity = entity as AuditEntity
  }

  if (userId) {
    filters.userId = userId as string
  }

  if (startDate) {
    filters.startDate = new Date(startDate as string)
  }

  if (endDate) {
    filters.endDate = new Date(endDate as string)
  }

  if (limit) {
    filters.limit = parseInt(limit as string, 10)
  }

  const logs = await AuditService.getLogs(filters)

  res.json(logs)
})

