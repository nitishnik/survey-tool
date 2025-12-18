import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Survey, SurveyFormData } from './survey-management.types'
import localStorageService from '@/services/localStorageService'
import { SURVEY_STATUS } from '@/constants/enums'
import type { RootState } from '@/store'
import auditService, { AuditAction, AuditEntity } from '@/services/auditService'

interface SurveyState {
  surveys: Survey[]
  currentSurvey: Survey | null
  isLoading: boolean
  error: string | null
}

const initialState: SurveyState = {
  surveys: [],
  currentSurvey: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchSurveys = createAsyncThunk(
  'survey/fetchSurveys',
  async (_, { rejectWithValue }) => {
    try {
      const surveys = localStorageService.getAll<Survey>('SURVEYS')
      return surveys
    } catch (error) {
      return rejectWithValue('Failed to fetch surveys')
    }
  }
)

export const fetchSurveyById = createAsyncThunk(
  'survey/fetchSurveyById',
  async (id: string, { rejectWithValue }) => {
    try {
      const survey = localStorageService.getById<Survey>('SURVEYS', id)
      if (!survey) {
        return rejectWithValue('Survey not found')
      }
      return survey
    } catch (error) {
      return rejectWithValue('Failed to fetch survey')
    }
  }
)

export const createSurvey = createAsyncThunk(
  'survey/createSurvey',
  async (surveyData: SurveyFormData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const currentUser = state.auth.user
      
      if (!currentUser) {
        return rejectWithValue('User not authenticated')
      }

      const newSurvey: Survey = {
        id: `survey_${Date.now()}`,
        ...surveyData,
        status: SURVEY_STATUS.DRAFT,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        version: 1,
      }

      const created = localStorageService.create<Survey>('SURVEYS', newSurvey)
      
      // Audit log
      auditService.log(AuditAction.CREATE, AuditEntity.SURVEY, created.id, {
        userId: currentUser.id,
        userEmail: currentUser.email,
        entityName: created.title,
      })
      
      return created
    } catch (error) {
      return rejectWithValue('Failed to create survey')
    }
  }
)

export const updateSurvey = createAsyncThunk(
  'survey/updateSurvey',
  async (
    { id, updates }: { id: string; updates: Partial<SurveyFormData> },
    { rejectWithValue, getState }
  ) => {
    try {
      const existing = localStorageService.getById<Survey>('SURVEYS', id)
      if (!existing) {
        return rejectWithValue('Survey not found')
      }

      // Only allow updating draft surveys
      if (existing.status !== SURVEY_STATUS.DRAFT) {
        return rejectWithValue('Cannot update published or closed surveys')
      }

      // Track changes for audit
      const changes: Record<string, { old: any; new: any }> = {}
      Object.keys(updates).forEach((key) => {
        const typedKey = key as keyof SurveyFormData
        if (existing[typedKey as keyof Survey] !== updates[typedKey]) {
          changes[key] = {
            old: existing[typedKey as keyof Survey],
            new: updates[typedKey],
          }
        }
      })

      const updated = localStorageService.update<Survey>('SURVEYS', id, {
        ...updates,
        version: existing.version + 1,
      })

      if (!updated) {
        return rejectWithValue('Failed to update survey')
      }

      // Audit log
      const state = getState() as RootState
      const currentUser = state.auth.user
      if (currentUser) {
        auditService.log(AuditAction.UPDATE, AuditEntity.SURVEY, id, {
          userId: currentUser.id,
          userEmail: currentUser.email,
          entityName: updated.title,
          changes: Object.keys(changes).length > 0 ? changes : undefined,
        })
      }

      return updated
    } catch (error) {
      return rejectWithValue('Failed to update survey')
    }
  }
)

export const deleteSurvey = createAsyncThunk(
  'survey/deleteSurvey',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const existing = localStorageService.getById<Survey>('SURVEYS', id)
      if (!existing) {
        return rejectWithValue('Survey not found')
      }

      // Only allow deleting draft surveys
      if (existing.status !== SURVEY_STATUS.DRAFT) {
        return rejectWithValue('Cannot delete published or closed surveys')
      }

      const deleted = localStorageService.delete('SURVEYS', id)
      if (!deleted) {
        return rejectWithValue('Failed to delete survey')
      }

      // Audit log
      const state = getState() as RootState
      const currentUser = state.auth.user
      if (currentUser) {
        auditService.log(AuditAction.DELETE, AuditEntity.SURVEY, id, {
          userId: currentUser.id,
          userEmail: currentUser.email,
          entityName: existing.title,
        })
      }

      return id
    } catch (error) {
      return rejectWithValue('Failed to delete survey')
    }
  }
)

export const publishSurvey = createAsyncThunk(
  'survey/publishSurvey',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const existing = localStorageService.getById<Survey>('SURVEYS', id)
      if (!existing) {
        return rejectWithValue('Survey not found')
      }

      if (existing.status !== SURVEY_STATUS.DRAFT) {
        return rejectWithValue('Only draft surveys can be published')
      }

      const updated = localStorageService.update<Survey>('SURVEYS', id, {
        status: SURVEY_STATUS.PUBLISHED,
      })

      if (!updated) {
        return rejectWithValue('Failed to publish survey')
      }

      // Audit log
      const state = getState() as RootState
      const currentUser = state.auth.user
      if (currentUser) {
        auditService.log(AuditAction.PUBLISH, AuditEntity.SURVEY, id, {
          userId: currentUser.id,
          userEmail: currentUser.email,
          entityName: updated.title,
        })
      }

      return updated
    } catch (error) {
      return rejectWithValue('Failed to publish survey')
    }
  }
)

export const closeSurvey = createAsyncThunk(
  'survey/closeSurvey',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const existing = localStorageService.getById<Survey>('SURVEYS', id)
      if (!existing) {
        return rejectWithValue('Survey not found')
      }

      const updated = localStorageService.update<Survey>('SURVEYS', id, {
        status: SURVEY_STATUS.CLOSED,
      })

      if (!updated) {
        return rejectWithValue('Failed to close survey')
      }

      // Audit log
      const state = getState() as RootState
      const currentUser = state.auth.user
      if (currentUser) {
        auditService.log(AuditAction.CLOSE, AuditEntity.SURVEY, id, {
          userId: currentUser.id,
          userEmail: currentUser.email,
          entityName: updated.title,
        })
      }

      return updated
    } catch (error) {
      return rejectWithValue('Failed to close survey')
    }
  }
)

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentSurvey: (state, action: PayloadAction<Survey | null>) => {
      state.currentSurvey = action.payload
    },
    clearCurrentSurvey: (state) => {
      state.currentSurvey = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch surveys
      .addCase(fetchSurveys.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSurveys.fulfilled, (state, action) => {
        state.isLoading = false
        state.surveys = action.payload
      })
      .addCase(fetchSurveys.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch survey by id
      .addCase(fetchSurveyById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSurveyById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentSurvey = action.payload
      })
      .addCase(fetchSurveyById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create survey
      .addCase(createSurvey.fulfilled, (state, action) => {
        state.surveys.push(action.payload)
        state.currentSurvey = action.payload
      })
      .addCase(createSurvey.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Update survey
      .addCase(updateSurvey.fulfilled, (state, action) => {
        const index = state.surveys.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.surveys[index] = action.payload
        }
        if (state.currentSurvey?.id === action.payload.id) {
          state.currentSurvey = action.payload
        }
      })
      .addCase(updateSurvey.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Delete survey
      .addCase(deleteSurvey.fulfilled, (state, action) => {
        state.surveys = state.surveys.filter((s) => s.id !== action.payload)
        if (state.currentSurvey?.id === action.payload) {
          state.currentSurvey = null
        }
      })
      .addCase(deleteSurvey.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Publish survey
      .addCase(publishSurvey.fulfilled, (state, action) => {
        const index = state.surveys.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.surveys[index] = action.payload
        }
        if (state.currentSurvey?.id === action.payload.id) {
          state.currentSurvey = action.payload
        }
      })
      .addCase(publishSurvey.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Close survey
      .addCase(closeSurvey.fulfilled, (state, action) => {
        const index = state.surveys.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.surveys[index] = action.payload
        }
        if (state.currentSurvey?.id === action.payload.id) {
          state.currentSurvey = action.payload
        }
      })
      .addCase(closeSurvey.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCurrentSurvey, clearCurrentSurvey } = surveySlice.actions

// Selectors
export const selectSurveys = (state: RootState) => state.survey.surveys
export const selectCurrentSurvey = (state: RootState) => state.survey.currentSurvey
export const selectSurveyById = (id: string) => (state: RootState) =>
  state.survey.surveys.find((s) => s.id === id)

export default surveySlice.reducer

