import { Response } from 'express'
import { z } from 'zod'
import { SurveyResponse } from '../models/SurveyResponse.model'
import { Survey } from '../models/Survey.model'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { AuditService } from '../services/audit.service'
import { AuditAction, AuditEntity } from '../models/AuditLog.model'

// Validation schemas
const submitResponseSchema = z.object({
  surveyId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      value: z.union([z.string(), z.number(), z.array(z.string())]),
    })
  ),
  anonymous: z.boolean(),
  respondentName: z.string().optional(),
  respondentEmail: z.string().email().optional(),
})

/**
 * Get responses by survey ID
 * GET /api/responses/survey/:surveyId
 */
export const getResponsesBySurveyId = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { surveyId } = req.params

  const responses = await SurveyResponse.find({ surveyId })
    .populate('userId', 'name email')
    .sort({ submittedAt: -1 })

  res.json(responses)
})

/**
 * Get response by ID
 * GET /api/responses/:id
 */
export const getResponseById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const response = await SurveyResponse.findById(req.params.id)
    .populate('userId', 'name email')
    .populate('surveyId', 'title')

  if (!response) {
    throw createError('Response not found', 404)
  }

  res.json(response)
})

/**
 * Submit response
 * POST /api/responses
 */
export const submitResponse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validated = submitResponseSchema.parse(req.body)

  // Check if survey exists and is accessible
  const survey = await Survey.findById(validated.surveyId)
  if (!survey) {
    throw createError('Survey not found', 404)
  }

  if (survey.status !== 'published') {
    throw createError('Survey is not available for responses', 400)
  }

  const now = new Date()
  if (now < new Date(survey.openDate) || now > new Date(survey.closeDate)) {
    throw createError('Survey is not currently open', 400)
  }

  // Check for duplicate submission
  if (!validated.anonymous && req.user) {
    const existingResponse = await SurveyResponse.findOne({
      surveyId: validated.surveyId,
      userId: req.user.userId,
    })

    if (existingResponse) {
      throw createError('You have already submitted a response to this survey', 409)
    }
  }

  // Check for anonymous duplicate by email
  if (validated.anonymous && validated.respondentEmail) {
    const existingResponse = await SurveyResponse.findOne({
      surveyId: validated.surveyId,
      anonymous: true,
      respondentEmail: validated.respondentEmail.toLowerCase(),
    })

    if (existingResponse) {
      throw createError('This email has already submitted a response to this survey', 409)
    }
  }

  // Create response
  const response = new SurveyResponse({
    surveyId: validated.surveyId,
    userId: validated.anonymous ? undefined : req.user?.userId,
    answers: validated.answers,
    anonymous: validated.anonymous,
    respondentName: validated.respondentName,
    respondentEmail: validated.respondentEmail?.toLowerCase(),
    submittedAt: new Date(),
  })

  await response.save()
  await response.populate('userId', 'name email')
  await response.populate('surveyId', 'title')

  // Audit log
  await AuditService.log(AuditAction.CREATE, AuditEntity.RESPONSE, response._id.toString(), {
    userId: req.user?.userId || 'anonymous',
    userEmail: req.user?.email || validated.respondentEmail,
    entityName: `Response to survey ${survey.title}`,
    req,
  })

  res.status(201).json(response)
})

/**
 * Delete response
 * DELETE /api/responses/:id
 */
export const deleteResponse = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const response = await SurveyResponse.findById(req.params.id)
  if (!response) {
    throw createError('Response not found', 404)
  }

  await SurveyResponse.findByIdAndDelete(req.params.id)

  res.status(204).send()
})

