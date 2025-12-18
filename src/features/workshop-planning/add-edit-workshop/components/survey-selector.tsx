import { useAppSelector, useAppDispatch } from '@/store'
import { fetchSurveys, selectSurveys } from '@/features/survey-management/survey-management.slice'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import HelpIcon from '@/components/common/HelpIcon'

interface SurveySelectorProps {
  selectedSurveyIds: string[]
  onToggle: (surveyId: string) => void
}

export default function SurveySelector({ selectedSurveyIds, onToggle }: SurveySelectorProps) {
  const dispatch = useAppDispatch()
  const surveys = useAppSelector(selectSurveys)

  useEffect(() => {
    dispatch(fetchSurveys())
  }, [dispatch])

  // Filter to only show closed or published surveys (surveys with results)
  const availableSurveys = surveys.filter(
    (s) => s.status === 'published' || s.status === 'closed'
  )

  if (availableSurveys.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 text-center py-4">
            No published or closed surveys available. Create and publish surveys first to link them to workshops.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Link Surveys</CardTitle>
          <HelpIcon content="Link surveys that informed this workshop. This helps track which survey insights led to the workshop creation." />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Select surveys that informed this workshop. Only published or closed surveys are available.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {availableSurveys.map((survey) => {
            const isSelected = selectedSurveyIds.includes(survey.id)
            return (
              <div
                key={survey.id}
                className="flex items-start gap-3 p-3 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-shadow"
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggle(survey.id)}
                  className="mt-1"
                />
                <div className="flex-1" onClick={() => onToggle(survey.id)}>
                  <Label className="font-medium cursor-pointer">{survey.title}</Label>
                  <p className="text-sm text-gray-500 mt-1">{survey.purpose}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>{survey.questions.length} questions</span>
                    <span>•</span>
                    <span className="capitalize">{survey.status}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {selectedSurveyIds.length > 0 && (
          <p className="text-sm text-gray-500 mt-4">
            {selectedSurveyIds.length} survey{selectedSurveyIds.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </CardContent>
    </Card>
  )
}

