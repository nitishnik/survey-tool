import { TargetAudience } from '@/features/survey-management/survey-management.types'
import { WORKSHOP_STATUS } from '@/constants/enums'

export interface WorkshopObjective {
  id: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export interface Workshop {
  id: string
  title: string
  description: string
  topic: string
  objectives: WorkshopObjective[]
  linkedSurveyIds: string[] // Surveys that informed this workshop
  targetAudience: TargetAudience
  expectedSize: number
  scheduledDate: string
  duration: number // in minutes
  location?: string
  status: WORKSHOP_STATUS
  createdBy: string
  createdAt: string
  updatedAt: string
  version: number
}

export interface WorkshopFormData {
  title: string
  description: string
  topic: string
  objectives: WorkshopObjective[]
  linkedSurveyIds: string[]
  targetAudience: TargetAudience
  expectedSize: number
  scheduledDate: string
  duration: number
  location?: string
}

