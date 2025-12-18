import { TEMPLATE_CATEGORY } from '@/constants/enums'
import { Question, TargetAudience } from '../survey-management/survey-management.types'

export interface SurveyTemplate {
  id: string
  name: string
  description: string
  category: TEMPLATE_CATEGORY
  questions: Question[]
  targetAudience: TargetAudience
  createdBy: string
  createdAt: string
  usageCount: number
}

export interface CreateTemplateData {
  name: string
  description: string
  category: TEMPLATE_CATEGORY
  questions: Question[]
  targetAudience: TargetAudience
}

