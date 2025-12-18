import { Router } from 'express'
import authRoutes from './auth.routes'
import surveyRoutes from './survey.routes'
import workshopRoutes from './workshop.routes'
import responseRoutes from './response.routes'
import templateRoutes from './template.routes'
import auditRoutes from './audit.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/surveys', surveyRoutes)
router.use('/workshops', workshopRoutes)
router.use('/responses', responseRoutes)
router.use('/templates', templateRoutes)
router.use('/audit-logs', auditRoutes)

export default router

