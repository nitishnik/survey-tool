import { Router } from 'express'
import {
  getWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  scheduleWorkshop,
  completeWorkshop,
} from '../controllers/workshop.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, getWorkshops)
router.get('/:id', authenticate, getWorkshopById)
router.post('/', authenticate, createWorkshop)
router.patch('/:id', authenticate, updateWorkshop)
router.delete('/:id', authenticate, deleteWorkshop)
router.post('/:id/schedule', authenticate, scheduleWorkshop)
router.post('/:id/complete', authenticate, completeWorkshop)

export default router

