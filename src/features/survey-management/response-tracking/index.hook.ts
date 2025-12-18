import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchSurveyById, selectCurrentSurvey } from '../../survey-management/survey-management.slice'
import {
  fetchResponsesBySurveyId,
  selectResponsesBySurveyId,
} from '@/features/survey-response/survey-response.slice'

export const useResponseTrackingHook = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const survey = useAppSelector(selectCurrentSurvey)
  const responses = useAppSelector((state) =>
    id ? selectResponsesBySurveyId(id)(state) : []
  )
  const isLoading = useAppSelector(
    (state) => state.survey.isLoading || state.response.isLoading
  )
  const [filterTeam, setFilterTeam] = useState<string>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')

  useEffect(() => {
    if (id) {
      dispatch(fetchSurveyById(id))
      dispatch(fetchResponsesBySurveyId(id))
    }
  }, [id, dispatch])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalResponses = responses.length
    const anonymousCount = responses.filter((r) => r.anonymous).length
    const namedCount = totalResponses - anonymousCount

    // Calculate response rate (mock - would need total target audience count)
    const responseRate = totalResponses > 0 ? Math.min(100, (totalResponses / 50) * 100) : 0

    return {
      totalResponses,
      anonymousCount,
      namedCount,
      responseRate: Math.round(responseRate),
    }
  }, [responses])

  // Filter responses
  const filteredResponses = useMemo(() => {
    let filtered = responses

    // Note: In a real app, we'd filter by actual team/department from user data
    // For now, we'll just return all responses
    return filtered
  }, [responses, filterTeam, filterDepartment])

  // Get unique teams and departments from target audience
  const availableTeams = useMemo(() => {
    return survey?.targetAudience.teams || []
  }, [survey])

  const availableDepartments = useMemo(() => {
    return survey?.targetAudience.departments || []
  }, [survey])

  return {
    survey,
    responses: filteredResponses,
    isLoading,
    stats,
    filterTeam,
    setFilterTeam,
    filterDepartment,
    setFilterDepartment,
    availableTeams,
    availableDepartments,
  }
}

