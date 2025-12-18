import { Workshop } from '../../workshop-planning.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Calendar, Users, Target, CheckCircle, Clock } from 'lucide-react'
import { WORKSHOP_STATUS } from '@/constants/enums'

interface WorkshopCardProps {
  workshop: Workshop
  onEdit: () => void
  onDelete: () => void
  onSchedule: () => void
  onComplete: () => void
}

export default function WorkshopCard({
  workshop,
  onEdit,
  onDelete,
  onSchedule,
  onComplete,
}: WorkshopCardProps) {
  const getStatusBadge = (status: WORKSHOP_STATUS) => {
    const styles: Record<WORKSHOP_STATUS, string> = {
      [WORKSHOP_STATUS.DRAFT]: 'bg-gray-100 text-gray-700',
      [WORKSHOP_STATUS.PLANNED]: 'bg-purple-100 text-purple-700',
      [WORKSHOP_STATUS.SCHEDULED]: 'bg-blue-100 text-blue-700',
      [WORKSHOP_STATUS.IN_PROGRESS]: 'bg-yellow-100 text-yellow-700',
      [WORKSHOP_STATUS.COMPLETED]: 'bg-green-100 text-green-700',
      [WORKSHOP_STATUS.CANCELLED]: 'bg-red-100 text-red-700',
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles[WORKSHOP_STATUS.DRAFT]}`}
      >
        {status.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const getTargetAudienceCount = () => {
    const { teams, departments, roles, locations } = workshop.targetAudience
    return (teams?.length || 0) + (departments?.length || 0) + (roles?.length || 0) + (locations?.length || 0)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{workshop.title}</CardTitle>
          {getStatusBadge(workshop.status)}
        </div>
        <p className="text-sm text-gray-500 mt-1">{workshop.topic}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{workshop.description}</p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(workshop.scheduledDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{workshop.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Expected: {workshop.expectedSize} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>{getTargetAudienceCount()} audience groups</span>
          </div>
          {workshop.location && (
            <div className="text-xs text-gray-400">📍 {workshop.location}</div>
          )}
          {workshop.linkedSurveyIds.length > 0 && (
            <div className="text-xs text-gray-400">
              📊 Linked to {workshop.linkedSurveyIds.length} survey{workshop.linkedSurveyIds.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          {workshop.status === WORKSHOP_STATUS.DRAFT && (
            <>
              <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="default" size="sm" onClick={onSchedule} className="flex-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                Schedule
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
          {workshop.status === WORKSHOP_STATUS.SCHEDULED && (
            <>
              <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="default" size="sm" onClick={onComplete} className="flex-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                Complete
              </Button>
            </>
          )}
          {(workshop.status === WORKSHOP_STATUS.COMPLETED || workshop.status === WORKSHOP_STATUS.CANCELLED) && (
            <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
              <Edit className="w-4 h-4 mr-1" />
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

