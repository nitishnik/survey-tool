import { Navigate } from 'react-router-dom'
import { useAuthState } from '@/hooks/useAuthState'
import { ROUTES } from './route'
import { USER_ROLE } from '@/constants/enums'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAuthState()

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  }

  return <>{children}</>
}

interface RoleProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: USER_ROLE[]
}

export const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const { userRole, isLoggedIn } = useAuthState()

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}

