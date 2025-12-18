import { Router } from 'express'
import {
  getSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  publishSurvey,
  closeSurvey,
} from '../controllers/survey.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, getSurveys)
router.get('/:id', authenticate, getSurveyById)
router.post('/', authenticate, createSurvey)
router.patch('/:id', authenticate, updateSurvey)
router.delete('/:id', authenticate, deleteSurvey)
router.post('/:id/publish', authenticate, publishSurvey)
router.post('/:id/close', authenticate, closeSurvey)

export default router

