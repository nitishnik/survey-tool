import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchSurveys, selectSurveys } from '../survey-management.slice'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'
import { ROUTES } from '@/routes/route'
import SurveyListSkeleton from './index.skeleton'
import SurveyCard from './components/survey-card'
import { useSurveyListHook } from './index.hook'
import { useAuthState } from '@/hooks/useAuthState'
import { canCreateSurvey } from '@/utils/permissionsUtil'

export default function SurveyList() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const surveys = useAppSelector(selectSurveys)
  const isLoading = useAppSelector((state) => state.survey.isLoading)
  const { userRole } = useAuthState()
  const { searchTerm, setSearchTerm, filteredSurveys, handlePublish, handleDelete } =
    useSurveyListHook()

  useEffect(() => {
    dispatch(fetchSurveys())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchSurveys())
  }, [dispatch])

  if (isLoading && surveys.length === 0) {
    return <SurveyListSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Surveys
          </h1>
          <p className="text-gray-600 mt-1">Manage and create surveys for your organization</p>
        </div>
        {canCreateSurvey(userRole) && (
          <Button onClick={() => navigate(ROUTES.SURVEYS.CREATE)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Survey
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search surveys by title or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Survey List */}
      {filteredSurveys.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No surveys match your search' : 'No surveys yet'}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate(ROUTES.SURVEYS.CREATE)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Survey
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onEdit={() => navigate(ROUTES.SURVEYS.EDIT.replace(':id', survey.id))}
              onView={() => navigate(ROUTES.SURVEYS.TRACKING.replace(':id', survey.id))}
              onPublish={() => handlePublish(survey.id)}
              onDelete={() => handleDelete(survey.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

