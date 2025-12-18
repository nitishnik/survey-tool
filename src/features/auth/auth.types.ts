import { USER_ROLE } from '@/constants/enums'

export interface User {
  id: string
  email: string
  name: string
  role: USER_ROLE
  department?: string
  team?: string
  location?: string
}

export interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
}

