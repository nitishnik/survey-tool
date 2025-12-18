import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { calculateAnalytics, selectAnalytics } from '../survey-results.slice'
import { fetchSurveyById, selectCurrentSurvey } from '@/features/survey-management/survey-management.slice'
import { fetchResponsesBySurveyId } from '@/features/survey-response/survey-response.slice'

export const useResultsDashboardHook = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const analytics = useAppSelector(selectAnalytics)
  const survey = useAppSelector(selectCurrentSurvey)
  const isLoading = useAppSelector((state) => state.results.isLoading || state.survey.isLoading)

  useEffect(() => {
    if (id) {
      dispatch(fetchSurveyById(id))
      dispatch(fetchResponsesBySurveyId(id))
      dispatch(calculateAnalytics(id))
    }
  }, [id, dispatch])

  return {
    analytics,
    survey,
    isLoading,
    surveyId: id,
  }
}

