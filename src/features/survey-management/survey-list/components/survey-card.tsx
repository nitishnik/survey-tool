import { Survey } from '../../survey-management.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye, Send, Calendar, Users, BarChart3 } from 'lucide-react'
import { SURVEY_STATUS } from '@/constants/enums'
import ShareSurveyModal from '../../share-survey/components/share-survey-modal'
import { ROUTES } from '@/routes/route'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from '@/hooks/useAuthState'
import { canEditSurvey, canDeleteSurvey, canPublishSurvey, canViewAnalytics } from '@/utils/permissionsUtil'

interface SurveyCardProps {
  survey: Survey
  onEdit: () => void
  onView: () => void
  onPublish: () => void
  onDelete: () => void
}

export default function SurveyCard({
  survey,
  onEdit,
  onView,
  onPublish,
  onDelete,
}: SurveyCardProps) {
  const navigate = useNavigate()
  const { userRole } = useAuthState()
  const getStatusBadge = (status: SURVEY_STATUS) => {
    const styles = {
      [SURVEY_STATUS.DRAFT]: 'bg-gray-100 text-gray-700',
      [SURVEY_STATUS.PUBLISHED]: 'bg-green-100 text-green-700',
      [SURVEY_STATUS.CLOSED]: 'bg-blue-100 text-blue-700',
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateString
    }
  }

  const getTargetAudienceCount = () => {
    const { teams, departments, roles, locations } = survey.targetAudience
    return (teams?.length || 0) + (departments?.length || 0) + (roles?.length || 0) + (locations?.length || 0)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{survey.title}</CardTitle>
          {getStatusBadge(survey.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{survey.purpose}</p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(survey.openDate)} - {formatDate(survey.closeDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{getTargetAudienceCount()} audience groups</span>
          </div>
          <div className="text-xs">
            {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          {survey.status === SURVEY_STATUS.DRAFT && (
            <>
              {canEditSurvey(userRole) && (
                <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
              {canPublishSurvey(userRole) && (
                <Button variant="default" size="sm" onClick={onPublish} className="flex-1">
                  <Send className="w-4 h-4 mr-1" />
                  Publish
                </Button>
              )}
              {canDeleteSurvey(userRole) && (
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </>
          )}
          {survey.status === SURVEY_STATUS.PUBLISHED && (
            <>
              {canPublishSurvey(userRole) && <ShareSurveyModal survey={survey} />}
              {canViewAnalytics(userRole) && (
                <Button variant="outline" size="sm" onClick={onView} className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  Track
                </Button>
              )}
            </>
          )}
          {survey.status === SURVEY_STATUS.CLOSED && (
            <>
              {canViewAnalytics(userRole) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(ROUTES.SURVEYS.RESULTS.replace(':id', survey.id))}
                  className="flex-1"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Results
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

