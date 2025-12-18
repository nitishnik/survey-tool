import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SurveyResponse, ResponseFormData } from './survey-response.types'
import { responseAPI } from '@/services/apiService'

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
      return await responseAPI.getBySurveyId(surveyId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch responses')
    }
  }
)

export const fetchResponseById = createAsyncThunk(
  'response/fetchResponseById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await responseAPI.getById(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch response')
    }
  }
)

export const submitResponse = createAsyncThunk(
  'response/submitResponse',
  async (
    { surveyId, responseData }: { surveyId: string; responseData: ResponseFormData },
    { rejectWithValue }
  ) => {
    try {
      // Mark as submitted in localStorage for client-side duplicate prevention
      const submissionKey = `survey_submission_${surveyId}`
      localStorage.setItem(submissionKey, 'true')

      return await responseAPI.submit(surveyId, responseData)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit response')
    }
  }
)

export const deleteResponse = createAsyncThunk(
  'response/deleteResponse',
  async (id: string, { rejectWithValue }) => {
    try {
      await responseAPI.delete(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete response')
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

