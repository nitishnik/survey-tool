import { Router } from 'express'
import {
  getTemplates,
  createTemplate,
  deleteTemplate,
  incrementTemplateUsage,
} from '../controllers/template.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, getTemplates)
router.post('/', authenticate, createTemplate)
router.delete('/:id', authenticate, deleteTemplate)
router.post('/:id/increment-usage', authenticate, incrementTemplateUsage)

export default router

