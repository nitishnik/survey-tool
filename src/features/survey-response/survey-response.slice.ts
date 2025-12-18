import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SurveyResponse, ResponseFormData } from './survey-response.types'
import localStorageService from '@/services/localStorageService'
import type { RootState } from '@/store'
import auditService, { AuditAction, AuditEntity } from '@/services/auditService'

interface ResponseState {
  responses: SurveyResponse[]
  currentResponse: SurveyResponse | null
  isLoading: boolean
  error: string | null
}

const initialState: ResponseState = {
  responses: [],
  currentResponse: null,
  isLoading: false,
  error: null,
}

export const fetchResponsesBySurveyId = createAsyncThunk(
  'response/fetchResponsesBySurveyId',
  async (surveyId: string, { rejectWithValue }) => {
    try {
      const allResponses = localStorageService.getAll<SurveyResponse>('RESPONSES')
      const filtered = allResponses.filter((r) => r.surveyId === surveyId)
      return filtered
    } catch (error) {
      return rejectWithValue('Failed to fetch responses')
    }
  }
)

export const fetchResponseById = createAsyncThunk(
  'response/fetchResponseById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = localStorageService.getById<SurveyResponse>('RESPONSES', id)
      if (!response) {
        return rejectWithValue('Response not found')
      }
      return response
    } catch (error) {
      return rejectWithValue('Failed to fetch response')
    }
  }
)

export const submitResponse = createAsyncThunk(
  'response/submitResponse',
  async (
    { surveyId, responseData }: { surveyId: string; responseData: ResponseFormData },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState
      const currentUser = state.auth.user

      // Check for duplicate submission
      const existingResponses = localStorageService.getAll<SurveyResponse>('RESPONSES')

      // Check if user already responded (for non-anonymous)
      if (!responseData.anonymous && currentUser) {
        const userResponse = existingResponses.find(
          (r) => r.surveyId === surveyId && r.userId === currentUser.id
        )
        if (userResponse) {
          return rejectWithValue('You have already submitted a response to this survey')
        }
      }

      // Check for anonymous duplicate by email
      if (responseData.anonymous && responseData.respondentEmail) {
        const emailResponse = existingResponses.find(
          (r) =>
            r.surveyId === surveyId &&
            r.anonymous &&
            r.respondentEmail?.toLowerCase() === responseData.respondentEmail?.toLowerCase()
        )
        if (emailResponse) {
          return rejectWithValue('This email has already submitted a response to this survey')
        }
      }

      // Check localStorage for anonymous duplicate prevention (fallback)
      const submissionKey = `survey_submission_${surveyId}`
      const hasSubmitted = localStorage.getItem(submissionKey)
      if (hasSubmitted && !currentUser && !responseData.respondentEmail) {
        return rejectWithValue('You have already submitted a response to this survey')
      }

      const newResponse: SurveyResponse = {
        id: `response_${Date.now()}`,
        surveyId,
        userId: responseData.anonymous ? undefined : currentUser?.id,
        answers: responseData.answers,
        submittedAt: new Date().toISOString(),
        anonymous: responseData.anonymous,
        respondentName: responseData.respondentName,
        respondentEmail: responseData.respondentEmail,
      }

      const created = localStorageService.create<SurveyResponse>('RESPONSES', newResponse)

      // Mark as submitted in localStorage
      localStorage.setItem(submissionKey, 'true')

      // Audit log
      auditService.log(AuditAction.CREATE, AuditEntity.RESPONSE, created.id, {
        userId: currentUser?.id,
        userEmail: currentUser?.email || responseData.respondentEmail,
        entityName: `Response to survey ${surveyId}`,
      })

      return created
    } catch (error) {
      return rejectWithValue('Failed to submit response')
    }
  }
)

export const deleteResponse = createAsyncThunk(
  'response/deleteResponse',
  async (id: string, { rejectWithValue }) => {
    try {
      const deleted = localStorageService.delete('RESPONSES', id)
      if (!deleted) {
        return rejectWithValue('Failed to delete response')
      }
      return id
    } catch (error) {
      return rejectWithValue('Failed to delete response')
    }
  }
)

const responseSlice = createSlice({
  name: 'response',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentResponse: (state) => {
      state.currentResponse = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponsesBySurveyId.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchResponsesBySurveyId.fulfilled, (state, action) => {
        state.isLoading = false
        state.responses = action.payload
      })
      .addCase(fetchResponsesBySurveyId.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchResponseById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchResponseById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentResponse = action.payload
      })
      .addCase(fetchResponseById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(submitResponse.fulfilled, (state, action) => {
        state.responses.push(action.payload)
        state.currentResponse = action.payload
      })
      .addCase(submitResponse.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(deleteResponse.fulfilled, (state, action) => {
        state.responses = state.responses.filter((r) => r.id !== action.payload)
        if (state.currentResponse?.id === action.payload) {
          state.currentResponse = null
        }
      })
      .addCase(deleteResponse.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearCurrentResponse } = responseSlice.actions

export const selectResponses = (state: RootState) => state.response.responses
export const selectResponsesBySurveyId = (surveyId: string) => (state: RootState) =>
  state.response.responses.filter((r) => r.surveyId === surveyId)
export const selectCurrentResponse = (state: RootState) => state.response.currentResponse

export default responseSlice.reducer

