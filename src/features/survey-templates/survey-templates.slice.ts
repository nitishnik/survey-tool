import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SurveyTemplate, CreateTemplateData } from './survey-templates.types'
import localStorageService from '@/services/localStorageService'
import type { RootState } from '@/store'

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
      const templates = localStorageService.getAll<SurveyTemplate>('TEMPLATES')
      return templates
    } catch (error) {
      return rejectWithValue('Failed to fetch templates')
    }
  }
)

export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (templateData: CreateTemplateData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const currentUser = state.auth.user

      if (!currentUser) {
        return rejectWithValue('User not authenticated')
      }

      const newTemplate: SurveyTemplate = {
        id: `template_${Date.now()}`,
        ...templateData,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        usageCount: 0,
      }

      const created = localStorageService.create<SurveyTemplate>('TEMPLATES', newTemplate)
      return created
    } catch (error) {
      return rejectWithValue('Failed to create template')
    }
  }
)

export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async (id: string, { rejectWithValue }) => {
    try {
      const deleted = localStorageService.delete('TEMPLATES', id)
      if (!deleted) {
        return rejectWithValue('Failed to delete template')
      }
      return id
    } catch (error) {
      return rejectWithValue('Failed to delete template')
    }
  }
)

export const incrementTemplateUsage = createAsyncThunk(
  'templates/incrementUsage',
  async (id: string, { rejectWithValue }) => {
    try {
      const existing = localStorageService.getById<SurveyTemplate>('TEMPLATES', id)
      if (!existing) {
        return rejectWithValue('Template not found')
      }

      const updated = localStorageService.update<SurveyTemplate>('TEMPLATES', id, {
        usageCount: existing.usageCount + 1,
      })

      if (!updated) {
        return rejectWithValue('Failed to update template')
      }

      return updated
    } catch (error) {
      return rejectWithValue('Failed to update template')
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

