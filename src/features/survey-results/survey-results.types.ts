import { QUESTION_TYPE } from '@/constants/enums'

export interface QuestionStatistics {
  questionId: string
  questionText: string
  questionType: QUESTION_TYPE
  totalResponses: number
  // For multiple choice
  optionCounts?: Record<string, number>
  // For rating scale
  averageRating?: number
  ratingDistribution?: Record<number, number>
  // For text questions
  textResponses?: string[]
  // Common
  responseRate: number
}

export interface SurveyAnalytics {
  surveyId: string
  totalResponses: number
  responseRate: number
  completionRate: number
  questionStatistics: QuestionStatistics[]
  insights: Insight[]
  trends?: TrendData[]
}

export interface Insight {
  type: 'pain_point' | 'requested_topic' | 'low_score' | 'suggestion' | 'trend'
  title: string
  description: string
  questionId?: string
  severity?: 'high' | 'medium' | 'low'
}

export interface TrendData {
  date: string
  responses: number
  averageRating?: number
}

export interface ComparisonData {
  group: string
  responses: number
  averageRating?: number
  responseRate: number
}

