import { Router } from 'express'
import {
  getResponsesBySurveyId,
  getResponseById,
  submitResponse,
  deleteResponse,
} from '../controllers/response.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/survey/:surveyId', authenticate, getResponsesBySurveyId)
router.get('/:id', authenticate, getResponseById)
router.post('/', submitResponse) // Allow anonymous submissions
router.delete('/:id', authenticate, deleteResponse)

export default router

