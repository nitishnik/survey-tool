import { useState, useMemo, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchWorkshops, deleteWorkshop, scheduleWorkshop, completeWorkshop, selectWorkshops } from '../workshop-planning.slice'
import { toast } from 'sonner'
import { getErrorMessage } from '@/utils/errorUtil'
import { MESSAGES } from '@/constants/messages'

export const useWorkshopListHook = () => {
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const workshops = useAppSelector(selectWorkshops)

  useEffect(() => {
    dispatch(fetchWorkshops())
  }, [dispatch])

  const filteredWorkshops = useMemo(() => {
    if (!searchTerm.trim()) return workshops

    const term = searchTerm.toLowerCase()
    return workshops.filter(
      (workshop) =>
        workshop.title.toLowerCase().includes(term) ||
        workshop.topic.toLowerCase().includes(term) ||
        workshop.description.toLowerCase().includes(term)
    )
  }, [workshops, searchTerm])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workshop? This action cannot be undone.')) {
      return
    }

    try {
      await dispatch(deleteWorkshop(id)).unwrap()
      toast.success(MESSAGES.SUCCESS.DELETED)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete workshop'))
    }
  }

  const handleSchedule = async (id: string) => {
    try {
      await dispatch(scheduleWorkshop(id)).unwrap()
      toast.success('Workshop scheduled successfully')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to schedule workshop'))
    }
  }

  const handleComplete = async (id: string) => {
    try {
      await dispatch(completeWorkshop(id)).unwrap()
      toast.success('Workshop marked as completed')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to complete workshop'))
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    filteredWorkshops,
    handleDelete,
    handleSchedule,
    handleComplete,
  }
}

