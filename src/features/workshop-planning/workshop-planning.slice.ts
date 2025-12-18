import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Workshop, WorkshopFormData } from './workshop-planning.types'
import { workshopAPI } from '@/services/apiService'

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
      return await workshopAPI.getAll()
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch workshops')
    }
  }
)

export const fetchWorkshopById = createAsyncThunk(
  'workshop/fetchWorkshopById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await workshopAPI.getById(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch workshop')
    }
  }
)

export const createWorkshop = createAsyncThunk(
  'workshop/createWorkshop',
  async (workshopData: WorkshopFormData, { rejectWithValue }) => {
    try {
      return await workshopAPI.create(workshopData)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create workshop')
    }
  }
)

export const updateWorkshop = createAsyncThunk(
  'workshop/updateWorkshop',
  async ({ id, updates }: { id: string; updates: Partial<WorkshopFormData> }, { rejectWithValue }) => {
    try {
      return await workshopAPI.update(id, updates)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update workshop')
    }
  }
)

export const deleteWorkshop = createAsyncThunk(
  'workshop/deleteWorkshop',
  async (id: string, { rejectWithValue }) => {
    try {
      await workshopAPI.delete(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete workshop')
    }
  }
)

export const scheduleWorkshop = createAsyncThunk(
  'workshop/scheduleWorkshop',
  async (id: string, { rejectWithValue }) => {
    try {
      return await workshopAPI.schedule(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to schedule workshop')
    }
  }
)

export const completeWorkshop = createAsyncThunk(
  'workshop/completeWorkshop',
  async (id: string, { rejectWithValue }) => {
    try {
      return await workshopAPI.complete(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to complete workshop')
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

