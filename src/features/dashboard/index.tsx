import { useAuthState } from '@/hooks/useAuthState'
import Onboarding from '@/components/common/Onboarding'
import { useDashboardHook } from './index.hook'

export default function Dashboard() {
  const { user } = useAuthState()
  const { stats } = useDashboardHook()

  return (
    <div className="space-y-6">
      <Onboarding />
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">Welcome back, <span className="font-semibold text-primary">{user?.name}</span>!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Surveys</h3>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-xl">📊</span>
            </div>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2">{stats.totalSurveys}</p>
          <p className="text-sm text-gray-500 mt-1">Total surveys</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Responses</h3>
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="text-accent text-xl">💬</span>
            </div>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mt-2">{stats.totalResponses}</p>
          <p className="text-sm text-gray-500 mt-1">Total responses</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Workshops</h3>
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <span className="text-chart-3 text-xl">🎓</span>
            </div>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent mt-2">{stats.totalWorkshops}</p>
          <p className="text-sm text-gray-500 mt-1">Total workshops</p>
        </div>
      </div>
    </div>
  )
}

