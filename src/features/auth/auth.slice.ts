import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User } from './auth.types'
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/storageUtil'
import localStorageService from '@/services/localStorageService'
import { USER_ROLE } from '@/constants/enums'
import type { RootState } from '@/store'

const AUTH_STORAGE_KEY = 'survey_tool_auth'

// Load initial auth state from localStorage
const loadAuthState = (): { user: User | null } => {
  const stored = getStorageItem<{ user: User | null }>(AUTH_STORAGE_KEY)
  return stored || { user: null }
}

const initialState: AuthState = {
  ...loadAuthState(),
  isLoggedIn: !!loadAuthState().user,
  isLoading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Mock login - in real app, this would be an API call
      // For now, we'll create a default user or find existing user
      const users = localStorageService.getAll<User>('USERS')
      let user = users.find((u) => u.email === credentials.email)

      if (!user) {
        // Determine role based on email pattern
        let role = USER_ROLE.ORGANIZER // default
        const emailLower = credentials.email.toLowerCase()
        
        if (emailLower.includes('admin@') || emailLower.startsWith('admin')) {
          role = USER_ROLE.ADMIN
        } else if (emailLower.includes('organizer@') || emailLower.startsWith('organizer')) {
          role = USER_ROLE.ORGANIZER
        } else if (emailLower.includes('participant@') || emailLower.startsWith('participant')) {
          role = USER_ROLE.PARTICIPANT
        } else if (emailLower.includes('viewer@') || emailLower.startsWith('viewer')) {
          role = USER_ROLE.VIEWER
        }
        
        // Create a default user for demo purposes
        user = {
          id: `user_${Date.now()}`,
          email: credentials.email,
          name: credentials.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          role,
        }
        localStorageService.create('USERS', user)
      }

      // Store auth state
      setStorageItem(AUTH_STORAGE_KEY, { user })
      return user
    } catch (error) {
      return rejectWithValue('Login failed')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  removeStorageItem(AUTH_STORAGE_KEY)
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isLoggedIn = true
      setStorageItem(AUTH_STORAGE_KEY, { user: action.payload })
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isLoggedIn = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isLoggedIn = false
        state.error = null
      })
  },
})

export const { clearError, setUser } = authSlice.actions

// Selectors
export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn

export default authSlice.reducer

