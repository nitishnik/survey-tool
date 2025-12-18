import { useCallback } from 'react'
import { useAppDispatch } from '@/store'
import { login, logout, setUser } from '@/features/auth/auth.slice'
import { User } from '@/features/auth/auth.types'

export const useAuth = () => {
  const dispatch = useAppDispatch()

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      return dispatch(login({ email, password }))
    },
    [dispatch]
  )

  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  const switchUser = useCallback(
    (user: User) => {
      dispatch(setUser(user))
    },
    [dispatch]
  )

  return {
    login: handleLogin,
    logout: handleLogout,
    switchUser,
  }
}

