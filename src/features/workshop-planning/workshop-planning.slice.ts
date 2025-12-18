import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Workshop, WorkshopFormData } from './workshop-planning.types'
import localStorageService from '@/services/localStorageService'
import { WORKSHOP_STATUS } from '@/constants/enums'
import type { RootState } from '@/store'

interface WorkshopState {
  workshops: Workshop[]
  currentWorkshop: Workshop | null
  isLoading: boolean
  error: string | null
}

const initialState: WorkshopState = {
  workshops: [],
  currentWorkshop: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchWorkshops = createAsyncThunk(
  'workshop/fetchWorkshops',
  async (_, { rejectWithValue }) => {
    try {
      const workshops = localStorageService.getAll<Workshop>('WORKSHOPS')
      return workshops
    } catch (error) {
      return rejectWithValue('Failed to fetch workshops')
    }
  }
)

export const fetchWorkshopById = createAsyncThunk(
  'workshop/fetchWorkshopById',
  async (id: string, { rejectWithValue }) => {
    try {
      const workshop = localStorageService.getById<Workshop>('WORKSHOPS', id)
      if (!workshop) {
        return rejectWithValue('Workshop not found')
      }
      return workshop
    } catch (error) {
      return rejectWithValue('Failed to fetch workshop')
    }
  }
)

export const createWorkshop = createAsyncThunk(
  'workshop/createWorkshop',
  async (workshopData: WorkshopFormData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const currentUser = state.auth.user

      if (!currentUser) {
        return rejectWithValue('User not authenticated')
      }

      const newWorkshop: Workshop = {
        id: `workshop_${Date.now()}`,
        ...workshopData,
        status: WORKSHOP_STATUS.DRAFT,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      }

      const created = localStorageService.create<Workshop>('WORKSHOPS', newWorkshop)
      return created
    } catch (error) {
      return rejectWithValue('Failed to create workshop')
    }
  }
)

export const updateWorkshop = createAsyncThunk(
  'workshop/updateWorkshop',
  async ({ id, updates }: { id: string; updates: Partial<WorkshopFormData> }, { rejectWithValue }) => {
    try {
      const updated = localStorageService.update<Workshop>('WORKSHOPS', id, {
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      if (!updated) {
        return rejectWithValue('Failed to update workshop')
      }
      return updated
    } catch (error) {
      return rejectWithValue('Failed to update workshop')
    }
  }
)

export const deleteWorkshop = createAsyncThunk(
  'workshop/deleteWorkshop',
  async (id: string, { rejectWithValue }) => {
    try {
      const deleted = localStorageService.delete('WORKSHOPS', id)
      if (!deleted) {
        return rejectWithValue('Failed to delete workshop')
      }
      return id
    } catch (error) {
      return rejectWithValue('Failed to delete workshop')
    }
  }
)

export const scheduleWorkshop = createAsyncThunk(
  'workshop/scheduleWorkshop',
  async (id: string, { rejectWithValue }) => {
    try {
      const existing = localStorageService.getById<Workshop>('WORKSHOPS', id)
      if (!existing) {
        return rejectWithValue('Workshop not found')
      }

      const updated = localStorageService.update<Workshop>('WORKSHOPS', id, {
        status: WORKSHOP_STATUS.SCHEDULED,
        updatedAt: new Date().toISOString(),
      })

      if (!updated) {
        return rejectWithValue('Failed to schedule workshop')
      }

      return updated
    } catch (error) {
      return rejectWithValue('Failed to schedule workshop')
    }
  }
)

export const completeWorkshop = createAsyncThunk(
  'workshop/completeWorkshop',
  async (id: string, { rejectWithValue }) => {
    try {
      const existing = localStorageService.getById<Workshop>('WORKSHOPS', id)
      if (!existing) {
        return rejectWithValue('Workshop not found')
      }

      const updated = localStorageService.update<Workshop>('WORKSHOPS', id, {
        status: WORKSHOP_STATUS.COMPLETED,
        updatedAt: new Date().toISOString(),
      })

      if (!updated) {
        return rejectWithValue('Failed to complete workshop')
      }

      return updated
    } catch (error) {
      return rejectWithValue('Failed to complete workshop')
    }
  }
)

const workshopSlice = createSlice({
  name: 'workshop',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentWorkshop: (state, action) => {
      state.currentWorkshop = action.payload
    },
    clearCurrentWorkshop: (state) => {
      state.currentWorkshop = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkshops.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWorkshops.fulfilled, (state, action) => {
        state.isLoading = false
        state.workshops = action.payload
      })
      .addCase(fetchWorkshops.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchWorkshopById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWorkshopById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentWorkshop = action.payload
      })
      .addCase(fetchWorkshopById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createWorkshop.fulfilled, (state, action) => {
        state.workshops.push(action.payload)
      })
      .addCase(createWorkshop.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(updateWorkshop.fulfilled, (state, action) => {
        const index = state.workshops.findIndex((w) => w.id === action.payload.id)
        if (index !== -1) {
          state.workshops[index] = action.payload
        }
        if (state.currentWorkshop?.id === action.payload.id) {
          state.currentWorkshop = action.payload
        }
      })
      .addCase(updateWorkshop.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(deleteWorkshop.fulfilled, (state, action) => {
        state.workshops = state.workshops.filter((w) => w.id !== action.payload)
        if (state.currentWorkshop?.id === action.payload) {
          state.currentWorkshop = null
        }
      })
      .addCase(deleteWorkshop.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(scheduleWorkshop.fulfilled, (state, action) => {
        const index = state.workshops.findIndex((w) => w.id === action.payload.id)
        if (index !== -1) {
          state.workshops[index] = action.payload
        }
        if (state.currentWorkshop?.id === action.payload.id) {
          state.currentWorkshop = action.payload
        }
      })
      .addCase(scheduleWorkshop.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(completeWorkshop.fulfilled, (state, action) => {
        const index = state.workshops.findIndex((w) => w.id === action.payload.id)
        if (index !== -1) {
          state.workshops[index] = action.payload
        }
        if (state.currentWorkshop?.id === action.payload.id) {
          state.currentWorkshop = action.payload
        }
      })
      .addCase(completeWorkshop.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCurrentWorkshop, clearCurrentWorkshop } = workshopSlice.actions

export const selectWorkshops = (state: RootState) => state.workshop.workshops
export const selectCurrentWorkshop = (state: RootState) => state.workshop.currentWorkshop
export const selectWorkshopById = (id: string) => (state: RootState) =>
  state.workshop.workshops.find((workshop) => workshop.id === id)

export default workshopSlice.reducer

