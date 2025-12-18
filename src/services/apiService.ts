import httpService from './httpService'
import { User } from '@/features/auth/auth.types'
import { Survey, SurveyFormData } from '@/features/survey-management/survey-management.types'
import { Workshop, WorkshopFormData } from '@/features/workshop-planning/workshop-planning.types'
import { SurveyResponse, ResponseFormData } from '@/features/survey-response/survey-response.types'
import { SurveyTemplate, CreateTemplateData } from '@/features/survey-templates/survey-templates.types'
import { AuditLog } from '@/services/auditService'

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await httpService.post<{ token: string; user: User }>('/auth/login', {
      email,
      password,
    })
    httpService.setToken(response.token)
    return response
  },

  register: async (
    email: string,
    password: string,
    name: string,
    role?: string
  ): Promise<{ token: string; user: User }> => {
    const response = await httpService.post<{ token: string; user: User }>('/auth/register', {
      email,
      password,
      name,
      role,
    })
    httpService.setToken(response.token)
    return response
  },

  getMe: async (): Promise<User> => {
    return httpService.get<User>('/auth/me')
  },

  logout: (): void => {
    httpService.removeToken()
  },
}

// Survey API
export const surveyAPI = {
  getAll: async (): Promise<Survey[]> => {
    const surveys = await httpService.get<any[]>('/surveys')
    return surveys.map(transformSurvey)
  },

  getById: async (id: string): Promise<Survey> => {
    const survey = await httpService.get<any>(`/surveys/${id}`)
    return transformSurvey(survey)
  },

  create: async (data: SurveyFormData): Promise<Survey> => {
    const survey = await httpService.post<any>('/surveys', data)
    return transformSurvey(survey)
  },

  update: async (id: string, updates: Partial<SurveyFormData>): Promise<Survey> => {
    const survey = await httpService.patch<any>(`/surveys/${id}`, updates)
    return transformSurvey(survey)
  },

  delete: async (id: string): Promise<void> => {
    await httpService.delete(`/surveys/${id}`)
  },

  publish: async (id: string): Promise<Survey> => {
    const survey = await httpService.post<any>(`/surveys/${id}/publish`)
    return transformSurvey(survey)
  },

  close: async (id: string): Promise<Survey> => {
    const survey = await httpService.post<any>(`/surveys/${id}/close`)
    return transformSurvey(survey)
  },
}

// Workshop API
export const workshopAPI = {
  getAll: async (): Promise<Workshop[]> => {
    const workshops = await httpService.get<any[]>('/workshops')
    return workshops.map(transformWorkshop)
  },

  getById: async (id: string): Promise<Workshop> => {
    const workshop = await httpService.get<any>(`/workshops/${id}`)
    return transformWorkshop(workshop)
  },

  create: async (data: WorkshopFormData): Promise<Workshop> => {
    const workshop = await httpService.post<any>('/workshops', data)
    return transformWorkshop(workshop)
  },

  update: async (id: string, updates: Partial<WorkshopFormData>): Promise<Workshop> => {
    const workshop = await httpService.patch<any>(`/workshops/${id}`, updates)
    return transformWorkshop(workshop)
  },

  delete: async (id: string): Promise<void> => {
    await httpService.delete(`/workshops/${id}`)
  },

  schedule: async (id: string): Promise<Workshop> => {
    const workshop = await httpService.post<any>(`/workshops/${id}/schedule`)
    return transformWorkshop(workshop)
  },

  complete: async (id: string): Promise<Workshop> => {
    const workshop = await httpService.post<any>(`/workshops/${id}/complete`)
    return transformWorkshop(workshop)
  },
}

// Response API
export const responseAPI = {
  getBySurveyId: async (surveyId: string): Promise<SurveyResponse[]> => {
    const responses = await httpService.get<any[]>(`/responses/survey/${surveyId}`)
    return responses.map(transformResponse)
  },

  getById: async (id: string): Promise<SurveyResponse> => {
    const response = await httpService.get<any>(`/responses/${id}`)
    return transformResponse(response)
  },

  submit: async (surveyId: string, data: ResponseFormData): Promise<SurveyResponse> => {
    const response = await httpService.post<any>('/responses', {
      surveyId,
      ...data,
    })
    return transformResponse(response)
  },

  delete: async (id: string): Promise<void> => {
    await httpService.delete(`/responses/${id}`)
  },
}

// Template API
export const templateAPI = {
  getAll: async (): Promise<SurveyTemplate[]> => {
    const templates = await httpService.get<any[]>('/templates')
    return templates.map(transformTemplate)
  },

  create: async (data: CreateTemplateData): Promise<SurveyTemplate> => {
    const template = await httpService.post<any>('/templates', data)
    return transformTemplate(template)
  },

  delete: async (id: string): Promise<void> => {
    await httpService.delete(`/templates/${id}`)
  },

  incrementUsage: async (id: string): Promise<SurveyTemplate> => {
    const template = await httpService.post<any>(`/templates/${id}/increment-usage`)
    return transformTemplate(template)
  },
}

// Audit API
export const auditAPI = {
  getLogs: async (filters?: {
    entityId?: string
    entity?: string
    userId?: string
    startDate?: string
    endDate?: string
    limit?: number
  }): Promise<AuditLog[]> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value))
        }
      })
    }
    const queryString = params.toString()
    const url = `/audit-logs${queryString ? `?${queryString}` : ''}`
    const logs = await httpService.get<any[]>(url)
    return logs.map(transformAuditLog)
  },
}

// Transform functions to convert backend format to frontend format
function transformSurvey(survey: any): Survey {
  return {
    id: survey._id || survey.id,
    title: survey.title,
    purpose: survey.purpose,
    targetAudience: survey.targetAudience,
    openDate: survey.openDate,
    closeDate: survey.closeDate,
    questions: survey.questions || [],
    status: survey.status,
    createdBy: typeof survey.createdBy === 'object' ? survey.createdBy._id : survey.createdBy,
    createdAt: survey.createdAt,
    templateId: survey.templateId,
    version: survey.version || 1,
  }
}

function transformWorkshop(workshop: any): Workshop {
  return {
    id: workshop._id || workshop.id,
    title: workshop.title,
    description: workshop.description,
    topic: workshop.topic,
    objectives: workshop.objectives || [],
    linkedSurveyIds: (workshop.linkedSurveyIds || []).map((s: any) => s._id || s),
    targetAudience: workshop.targetAudience,
    expectedSize: workshop.expectedSize,
    scheduledDate: workshop.scheduledDate,
    duration: workshop.duration,
    location: workshop.location,
    status: workshop.status,
    createdBy: typeof workshop.createdBy === 'object' ? workshop.createdBy._id : workshop.createdBy,
    createdAt: workshop.createdAt,
    updatedAt: workshop.updatedAt,
    version: workshop.version || 1,
  }
}

function transformResponse(response: any): SurveyResponse {
  return {
    id: response._id || response.id,
    surveyId: typeof response.surveyId === 'object' ? response.surveyId._id : response.surveyId,
    userId: response.userId ? (typeof response.userId === 'object' ? response.userId._id : response.userId) : undefined,
    answers: response.answers || [],
    submittedAt: response.submittedAt,
    anonymous: response.anonymous,
    respondentName: response.respondentName,
    respondentEmail: response.respondentEmail,
  }
}

function transformTemplate(template: any): SurveyTemplate {
  return {
    id: template._id || template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    questions: template.questions || [],
    targetAudience: template.targetAudience,
    createdBy: typeof template.createdBy === 'object' ? template.createdBy._id : template.createdBy,
    createdAt: template.createdAt,
    usageCount: template.usageCount || 0,
  }
}

function transformAuditLog(log: any): AuditLog {
  return {
    id: log._id || log.id,
    userId: typeof log.userId === 'object' ? log.userId._id : log.userId,
    userEmail: log.userEmail,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    entityName: log.entityName,
    changes: log.changes,
    timestamp: log.timestamp,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
  }
}

