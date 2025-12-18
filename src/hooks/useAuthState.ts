import { useAppSelector } from '@/store'
import { selectAuth, selectUser, selectIsLoggedIn } from '@/features/auth/auth.slice'
import { USER_ROLE } from '@/constants/enums'

export const useAuthState = () => {
  const auth = useAppSelector(selectAuth)
  const user = useAppSelector(selectUser)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return {
    user,
    userRole: user?.role as USER_ROLE | undefined,
    userProfile: user,
    isLoggedIn,
    isLoading: auth.isLoading,
    error: auth.error,
  }
}

