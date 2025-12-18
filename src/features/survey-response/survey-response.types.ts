export interface Answer {
  questionId: string
  value: string | number | string[] // string for text, number for rating, string[] for multiple choice
}

export interface SurveyResponse {
  id: string
  surveyId: string
  userId?: string // Optional for anonymous responses
  answers: Answer[]
  submittedAt: string
  anonymous: boolean
  respondentName?: string // Optional name for anonymous responses
  respondentEmail?: string // Optional email
}

export interface ResponseFormData {
  answers: Answer[]
  anonymous: boolean
  respondentName?: string
  respondentEmail?: string
}

