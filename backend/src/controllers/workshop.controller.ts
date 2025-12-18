import { Response } from 'express'
import { z } from 'zod'
import { Workshop, WORKSHOP_STATUS } from '../models/Workshop.model'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { AuditService } from '../services/audit.service'
import { AuditAction, AuditEntity } from '../models/AuditLog.model'

// Validation schemas
const createWorkshopSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  topic: z.string().min(1, 'Topic is required'),
  objectives: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      priority: z.enum(['high', 'medium', 'low']),
    })
  ),
  linkedSurveyIds: z.array(z.string()),
  targetAudience: z.object({
    teams: z.array(z.string()).optional(),
    departments: z.array(z.string()).optional(),
    roles: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
  }),
  expectedSize: z.number().min(1),
  scheduledDate: z.string().datetime(),
  duration: z.number().min(1),
  location: z.string().optional(),
})

const updateWorkshopSchema = createWorkshopSchema.partial()

/**
 * Get all workshops
 * GET /api/workshops
 */
export const getWorkshops = asyncHandler(async (req: AuthRequest, res: Response) => {
  const workshops = await Workshop.find()
    .populate('createdBy', 'name email')
    .populate('linkedSurveyIds', 'title')
    .sort({ createdAt: -1 })

  res.json(workshops)
})

/**
 * Get workshop by ID
 * GET /api/workshops/:id
 */
export const getWorkshopById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const workshop = await Workshop.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('linkedSurveyIds', 'title')

  if (!workshop) {
    throw createError('Workshop not found', 404)
  }

  res.json(workshop)
})

/**
 * Create workshop
 * POST /api/workshops
 */
export const createWorkshop = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const validated = createWorkshopSchema.parse(req.body)

  const workshop = new Workshop({
    ...validated,
    scheduledDate: new Date(validated.scheduledDate),
    linkedSurveyIds: validated.linkedSurveyIds.map((id) => id),
    status: WORKSHOP_STATUS.DRAFT,
    createdBy: req.user.userId,
    version: 1,
  })

  await workshop.save()
  await workshop.populate('createdBy', 'name email')
  await workshop.populate('linkedSurveyIds', 'title')

  res.status(201).json(workshop)
})

/**
 * Update workshop
 * PATCH /api/workshops/:id
 */
export const updateWorkshop = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const workshop = await Workshop.findById(req.params.id)
  if (!workshop) {
    throw createError('Workshop not found', 404)
  }

  const validated = updateWorkshopSchema.parse(req.body)

  Object.assign(workshop, {
    ...validated,
    scheduledDate: validated.scheduledDate ? new Date(validated.scheduledDate) : workshop.scheduledDate,
    linkedSurveyIds: validated.linkedSurveyIds || workshop.linkedSurveyIds,
  })

  await workshop.save()
  await workshop.populate('createdBy', 'name email')
  await workshop.populate('linkedSurveyIds', 'title')

  res.json(workshop)
})

/**
 * Delete workshop
 * DELETE /api/workshops/:id
 */
export const deleteWorkshop = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const workshop = await Workshop.findById(req.params.id)
  if (!workshop) {
    throw createError('Workshop not found', 404)
  }

  await Workshop.findByIdAndDelete(req.params.id)

  res.status(204).send()
})

/**
 * Schedule workshop
 * POST /api/workshops/:id/schedule
 */
export const scheduleWorkshop = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const workshop = await Workshop.findById(req.params.id)
  if (!workshop) {
    throw createError('Workshop not found', 404)
  }

  workshop.status = WORKSHOP_STATUS.SCHEDULED
  await workshop.save()
  await workshop.populate('createdBy', 'name email')
  await workshop.populate('linkedSurveyIds', 'title')

  // Audit log
  await AuditService.log(AuditAction.SCHEDULE, AuditEntity.WORKSHOP, workshop._id.toString(), {
    userId: req.user.userId,
    userEmail: req.user.email,
    entityName: workshop.title,
    req,
  })

  res.json(workshop)
})

/**
 * Complete workshop
 * POST /api/workshops/:id/complete
 */
export const completeWorkshop = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const workshop = await Workshop.findById(req.params.id)
  if (!workshop) {
    throw createError('Workshop not found', 404)
  }

  workshop.status = WORKSHOP_STATUS.COMPLETED
  await workshop.save()
  await workshop.populate('createdBy', 'name email')
  await workshop.populate('linkedSurveyIds', 'title')

  // Audit log
  await AuditService.log(AuditAction.COMPLETE, AuditEntity.WORKSHOP, workshop._id.toString(), {
    userId: req.user.userId,
    userEmail: req.user.email,
    entityName: workshop.title,
    req,
  })

  res.json(workshop)
})

