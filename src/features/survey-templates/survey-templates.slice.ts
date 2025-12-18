import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SurveyTemplate, CreateTemplateData } from './survey-templates.types'
import { templateAPI } from '@/services/apiService'

interface TemplateState {
  templates: SurveyTemplate[]
  isLoading: boolean
  error: string | null
}

const initialState: TemplateState = {
  templates: [],
  isLoading: false,
  error: null,
}

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      return await templateAPI.getAll()
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch templates')
    }
  }
)

export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (templateData: CreateTemplateData, { rejectWithValue }) => {
    try {
      return await templateAPI.create(templateData)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create template')
    }
  }
)

export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async (id: string, { rejectWithValue }) => {
    try {
      await templateAPI.delete(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete template')
    }
  }
)

export const incrementTemplateUsage = createAsyncThunk(
  'templates/incrementUsage',
  async (id: string, { rejectWithValue }) => {
    try {
      return await templateAPI.incrementUsage(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update template')
    }
  }
)

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false
        state.templates = action.payload
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.templates.push(action.payload)
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter((t) => t.id !== action.payload)
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(incrementTemplateUsage.fulfilled, (state, action) => {
        const index = state.templates.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.templates[index] = action.payload
        }
      })
  },
})

export const { clearError } = templateSlice.actions

export const selectTemplates = (state: RootState) => state.templates.templates
export const selectTemplateById = (id: string) => (state: RootState) =>
  state.templates.templates.find((t) => t.id === id)

export default templateSlice.reducer

