import { Response } from 'express'
import { z } from 'zod'
import { Survey, SURVEY_STATUS } from '../models/Survey.model'
import { asyncHandler, createError, AuthRequest } from '../middleware/errorHandler'
import { AuditService } from '../services/audit.service'
import { AuditAction, AuditEntity } from '../models/AuditLog.model'

// Validation schemas
const createSurveySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  targetAudience: z.object({
    teams: z.array(z.string()).optional(),
    departments: z.array(z.string()).optional(),
    roles: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
  }),
  openDate: z.string().datetime(),
  closeDate: z.string().datetime(),
  questions: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      text: z.string(),
      options: z.array(z.string()).optional(),
      required: z.boolean(),
      order: z.number(),
    })
  ),
  templateId: z.string().optional(),
})

const updateSurveySchema = createSurveySchema.partial()

/**
 * Get all surveys
 * GET /api/surveys
 */
export const getSurveys = asyncHandler(async (req: AuthRequest, res: Response) => {
  const surveys = await Survey.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })

  res.json(surveys)
})

/**
 * Get survey by ID
 * GET /api/surveys/:id
 */
export const getSurveyById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const survey = await Survey.findById(req.params.id).populate('createdBy', 'name email')

  if (!survey) {
    throw createError('Survey not found', 404)
  }

  // Log view
  if (req.user) {
    await AuditService.log(AuditAction.VIEW, AuditEntity.SURVEY, survey._id.toString(), {
      userId: req.user.userId,
      userEmail: req.user.email,
      entityName: survey.title,
      req,
    })
  }

  res.json(survey)
})

/**
 * Create survey
 * POST /api/surveys
 */
export const createSurvey = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const validated = createSurveySchema.parse(req.body)

  const survey = new Survey({
    ...validated,
    openDate: new Date(validated.openDate),
    closeDate: new Date(validated.closeDate),
    status: SURVEY_STATUS.DRAFT,
    createdBy: req.user.userId,
    version: 1,
  })

  await survey.save()
  await survey.populate('createdBy', 'name email')

  // Audit log
  await AuditService.log(AuditAction.CREATE, AuditEntity.SURVEY, survey._id.toString(), {
    userId: req.user.userId,
    userEmail: req.user.email,
    entityName: survey.title,
    req,
  })

  res.status(201).json(survey)
})

/**
 * Update survey
 * PATCH /api/surveys/:id
 */
export const updateSurvey = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const survey = await Survey.findById(req.params.id)
  if (!survey) {
    throw createError('Survey not found', 404)
  }

  // Only allow updating draft surveys
  if (survey.status !== SURVEY_STATUS.DRAFT) {
    throw createError('Cannot update published or closed surveys', 400)
  }

  const validated = updateSurveySchema.parse(req.body)

  // Track changes for audit
  const changes: Record<string, { old: any; new: any }> = {}
  Object.keys(validated).forEach((key) => {
    const typedKey = key as keyof typeof validated
    if (survey[typedKey as keyof typeof survey] !== validated[typedKey]) {
      changes[key] = {
        old: survey[typedKey as keyof typeof survey],
        new: validated[typedKey],
      }
    }
  })

  Object.assign(survey, {
    ...validated,
    openDate: validated.openDate ? new Date(validated.openDate) : survey.openDate,
    closeDate: validated.closeDate ? new Date(validated.closeDate) : survey.closeDate,
    version: survey.version + 1,
  })

  await survey.save()
  await survey.populate('createdBy', 'name email')

  // Audit log
  await AuditService.log(AuditAction.UPDATE, AuditEntity.SURVEY, survey._id.toString(), {
    userId: req.user.userId,
    userEmail: req.user.email,
    entityName: survey.title,
    changes: Object.keys(changes).length > 0 ? changes : undefined,
    req,
  })

  res.json(survey)
})

/**
 * Delete survey
 * DELETE /api/surveys/:id
 */
export const deleteSurvey = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const survey = await Survey.findById(req.params.id)
  if (!survey) {
    throw createError('Survey not found', 404)
  }

  // Only allow deleting draft surveys
  if (survey.status !== SURVEY_STATUS.DRAFT) {
    throw createError('Cannot delete published or closed surveys', 400)
  }

  const surveyTitle = survey.title

  await Survey.findByIdAndDelete(req.params.id)

  // Audit log
  await AuditService.log(AuditAction.DELETE, AuditEntity.SURVEY, req.params.id, {
    userId: req.user.userId,
    userEmail: req.user.email,
    entityName: surveyTitle,
    req,
  })

  res.status(204).send()
})

/**
 * Publish survey
 * POST /api/surveys/:id/publish
 */
export const publishSurvey = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const survey = await Survey.findById(req.params.id)
  if (!survey) {
    throw createError('Survey not found', 404)
  }

  if (survey.status !== SURVEY_STATUS.DRAFT) {
    throw createError('Only draft surveys can be published', 400)
  }

  survey.status = SURVEY_STATUS.PUBLISHED
  await survey.save()
  await survey.populate('createdBy', 'name email')

  // Audit log
  await AuditService.log(AuditAction.PUBLISH, AuditEntity.SURVEY, survey._id.toString(), {
    userId: req.user.userId,
    userEmail: req.user.email,
    entityName: survey.title,
    req,
  })

  res.json(survey)
})

/**
 * Close survey
 * POST /api/surveys/:id/close
 */
export const closeSurvey = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const survey = await Survey.findById(req.params.id)
  if (!survey) {
    throw createError('Survey not found', 404)
  }

  survey.status = SURVEY_STATUS.CLOSED
  await survey.save()
  await survey.populate('createdBy', 'name email')

  // Audit log
  await AuditService.log(AuditAction.CLOSE, AuditEntity.SURVEY, survey._id.toString(), {
    userId: req.user.userId,
    userEmail: req.user.email,
    entityName: survey.title,
    req,
  })

  res.json(survey)
})

