import { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { ROUTES } from './route'
import MainLayout from '@/components/layouts/MainLayout'
import { ProtectedRoute, RoleProtectedRoute } from './authRoute'
import { USER_ROLE } from '@/constants/enums'
import NotFoundPage from '@/components/common/NotFoundPage'

// Lazy load components
const Login = lazy(() => import('@/features/auth/login'))
const Dashboard = lazy(() => import('@/features/dashboard'))
const SurveyList = lazy(() => import('@/features/survey-management/survey-list'))
const AddEditSurvey = lazy(() => import('@/features/survey-management/add-edit-survey'))
const TemplateList = lazy(() => import('@/features/survey-templates/template-list'))
const RespondPage = lazy(() => import('@/features/survey-response/respond'))
const ResponseTracking = lazy(() => import('@/features/survey-management/response-tracking'))
const ResultsDashboard = lazy(() => import('@/features/survey-results/results-dashboard'))
const WorkshopList = lazy(() => import('@/features/workshop-planning/workshop-list'))
const AddEditWorkshop = lazy(() => import('@/features/workshop-planning/add-edit-workshop'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="mt-2 text-gray-600">Loading...</p>
    </div>
  </div>
)


export const RouteManager = () => {
  const routes = useRoutes([
    {
      path: ROUTES.AUTH.LOGIN,
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: ROUTES.HOME,
      element: (
        <ProtectedRoute>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.SURVEYS.LIST,
      element: (
        <ProtectedRoute>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <SurveyList />
            </Suspense>
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.SURVEYS.CREATE,
      element: (
        <RoleProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.ORGANIZER]}>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <AddEditSurvey />
            </Suspense>
          </MainLayout>
        </RoleProtectedRoute>
      ),
    },
    {
      path: ROUTES.SURVEYS.EDIT,
      element: (
        <RoleProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.ORGANIZER]}>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <AddEditSurvey />
            </Suspense>
          </MainLayout>
        </RoleProtectedRoute>
      ),
    },
    {
      path: ROUTES.SURVEYS.TEMPLATES,
      element: (
        <RoleProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.ORGANIZER]}>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <TemplateList />
            </Suspense>
          </MainLayout>
        </RoleProtectedRoute>
      ),
    },
    {
      path: ROUTES.SURVEYS.RESPONSE,
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <RespondPage />
        </Suspense>
      ),
    },
    {
      path: ROUTES.SURVEYS.TRACKING,
      element: (
        <RoleProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.ORGANIZER, USER_ROLE.VIEWER]}>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <ResponseTracking />
            </Suspense>
          </MainLayout>
        </RoleProtectedRoute>
      ),
    },
    {
      path: ROUTES.SURVEYS.RESULTS,
      element: (
        <RoleProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.ORGANIZER, USER_ROLE.VIEWER]}>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <ResultsDashboard />
            </Suspense>
          </MainLayout>
        </RoleProtectedRoute>
      ),
    },
    {
      path: ROUTES.WORKSHOPS.LIST,
      element: (
        <RoleProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.ORGANIZER, USER_ROLE.VIEWER]}>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <WorkshopList />
            </Suspense>
          </MainLayout>
        </RoleProtectedRoute>
      ),
    },
    {
      path: ROUTES.WORKSHOPS.CREATE,
      element: (
        <RoleProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.ORGANIZER]}>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <AddEditWorkshop />
            </Suspense>
          </MainLayout>
        </RoleProtectedRoute>
      ),
    },
    {
      path: ROUTES.WORKSHOPS.EDIT,
      element: (
        <RoleProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.ORGANIZER]}>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <AddEditWorkshop />
            </Suspense>
          </MainLayout>
        </RoleProtectedRoute>
      ),
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ])

  return routes
}

