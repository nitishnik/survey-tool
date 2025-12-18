import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchSurveys, selectSurveys } from '@/features/survey-management/survey-management.slice'
import { fetchWorkshops, selectWorkshops } from '@/features/workshop-planning/workshop-planning.slice'
import localStorageService from '@/services/localStorageService'
import { SurveyResponse } from '@/features/survey-response/survey-response.types'

export const useDashboardHook = () => {
  const dispatch = useAppDispatch()
  const surveys = useAppSelector(selectSurveys)
  const workshops = useAppSelector(selectWorkshops)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refreshData = () => {
    dispatch(fetchSurveys())
    dispatch(fetchWorkshops())
    setRefreshTrigger((prev) => prev + 1) // Trigger stats recalculation
  }

  useEffect(() => {
    // Fetch all data on mount
    refreshData()

    // Refresh data when window regains focus (user comes back to the tab)
    const handleFocus = () => {
      refreshData()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [dispatch])

  // Calculate statistics - recalculate when any dependency changes
  const stats = useMemo(() => {
    // Always read fresh from localStorage for responses
    const responses = localStorageService.getAll<SurveyResponse>('RESPONSES')
    return {
      totalSurveys: surveys.length,
      totalResponses: responses.length,
      totalWorkshops: workshops.length,
    }
  }, [surveys.length, workshops.length, refreshTrigger]) // Recalculate when counts change or refresh triggered

  return {
    stats,
    isLoading: false, // Could add loading states if needed
  }
}

