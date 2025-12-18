import { useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { publishSurvey, deleteSurvey, selectSurveys } from '../survey-management.slice'
import { toast } from 'sonner'
import { getErrorMessage } from '@/utils/errorUtil'
import { MESSAGES } from '@/constants/messages'

export const useSurveyListHook = () => {
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const surveys = useAppSelector(selectSurveys)

  const filteredSurveys = useMemo(() => {
    if (!searchTerm.trim()) return surveys

    const term = searchTerm.toLowerCase()
    return surveys.filter(
      (survey) =>
        survey.title.toLowerCase().includes(term) ||
        survey.purpose.toLowerCase().includes(term)
    )
  }, [surveys, searchTerm])

  const handlePublish = async (id: string) => {
    try {
      await dispatch(publishSurvey(id)).unwrap()
      toast.success(MESSAGES.SUCCESS.PUBLISHED)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to publish survey'))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
      return
    }

    try {
      await dispatch(deleteSurvey(id)).unwrap()
      toast.success(MESSAGES.SUCCESS.DELETED)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete survey'))
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    filteredSurveys,
    handlePublish,
    handleDelete,
  }
}

