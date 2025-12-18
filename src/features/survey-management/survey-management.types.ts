import { SURVEY_STATUS, QUESTION_TYPE } from '@/constants/enums'

export interface Question {
  id: string
  type: QUESTION_TYPE
  text: string
  options?: string[] // For multiple choice
  required: boolean
  order: number
}

export interface TargetAudience {
  teams?: string[]
  departments?: string[]
  roles?: string[]
  locations?: string[]
}

export interface Survey {
  id: string
  title: string
  purpose: string
  targetAudience: TargetAudience
  openDate: string
  closeDate: string
  questions: Question[]
  status: SURVEY_STATUS
  createdBy: string
  createdAt: string
  templateId?: string
  version: number
}

export interface SurveyFormData {
  title: string
  purpose: string
  targetAudience: TargetAudience
  openDate: string
  closeDate: string
  questions: Question[]
}

