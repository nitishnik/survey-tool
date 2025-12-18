import { Response } from 'express'
import { z } from 'zod'
import { SurveyTemplate, TEMPLATE_CATEGORY } from '../models/SurveyTemplate.model'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'

// Validation schemas
const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.nativeEnum(TEMPLATE_CATEGORY),
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
  targetAudience: z.object({
    teams: z.array(z.string()).optional(),
    departments: z.array(z.string()).optional(),
    roles: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
  }),
})

/**
 * Get all templates
 * GET /api/templates
 */
export const getTemplates = asyncHandler(async (req: AuthRequest, res: Response) => {
  const templates = await SurveyTemplate.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })

  res.json(templates)
})

/**
 * Create template
 * POST /api/templates
 */
export const createTemplate = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const validated = createTemplateSchema.parse(req.body)

  const template = new SurveyTemplate({
    ...validated,
    createdBy: req.user.userId,
    usageCount: 0,
  })

  await template.save()
  await template.populate('createdBy', 'name email')

  res.status(201).json(template)
})

/**
 * Delete template
 * DELETE /api/templates/:id
 */
export const deleteTemplate = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const template = await SurveyTemplate.findById(req.params.id)
  if (!template) {
    throw createError('Template not found', 404)
  }

  await SurveyTemplate.findByIdAndDelete(req.params.id)

  res.status(204).send()
})

/**
 * Increment template usage count
 * POST /api/templates/:id/increment-usage
 */
export const incrementTemplateUsage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const template = await SurveyTemplate.findById(req.params.id)
  if (!template) {
    throw createError('Template not found', 404)
  }

  template.usageCount += 1
  await template.save()
  await template.populate('createdBy', 'name email')

  res.json(template)
})

