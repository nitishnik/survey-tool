import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Survey, SurveyFormData } from './survey-management.types'
import { surveyAPI } from '@/services/apiService'

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
      return await surveyAPI.getAll()
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch surveys')
    }
  }
)

export const fetchSurveyById = createAsyncThunk(
  'survey/fetchSurveyById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await surveyAPI.getById(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch survey')
    }
  }
)

export const createSurvey = createAsyncThunk(
  'survey/createSurvey',
  async (surveyData: SurveyFormData, { rejectWithValue }) => {
    try {
      return await surveyAPI.create(surveyData)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create survey')
    }
  }
)

export const updateSurvey = createAsyncThunk(
  'survey/updateSurvey',
  async (
    { id, updates }: { id: string; updates: Partial<SurveyFormData> },
    { rejectWithValue }
  ) => {
    try {
      return await surveyAPI.update(id, updates)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update survey')
    }
  }
)

export const deleteSurvey = createAsyncThunk(
  'survey/deleteSurvey',
  async (id: string, { rejectWithValue }) => {
    try {
      await surveyAPI.delete(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete survey')
    }
  }
)

export const publishSurvey = createAsyncThunk(
  'survey/publishSurvey',
  async (id: string, { rejectWithValue }) => {
    try {
      return await surveyAPI.publish(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to publish survey')
    }
  }
)

export const closeSurvey = createAsyncThunk(
  'survey/closeSurvey',
  async (id: string, { rejectWithValue }) => {
    try {
      return await surveyAPI.close(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to close survey')
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

