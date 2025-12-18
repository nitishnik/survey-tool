import { useEffect } from 'react'
import { useFormik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  createWorkshop,
  updateWorkshop,
  fetchWorkshopById,
  selectCurrentWorkshop,
} from '../workshop-planning.slice'
import { initialValues, validationSchema, FormValues } from './index.form'
import { toast } from 'sonner'
import { getErrorMessage } from '@/utils/errorUtil'
import { ROUTES } from '@/routes/route'
import { MESSAGES } from '@/constants/messages'
import { WorkshopObjective, WorkshopFormData } from '../workshop-planning.types'

const toDateTimeLocal = (isoString: string) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}

export const useAddEditWorkshopHook = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const dispatch = useAppDispatch()
  const currentWorkshop = useAppSelector(selectCurrentWorkshop)
  const isLoading = useAppSelector((state) => state.workshop.isLoading)

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Convert datetime-local string back to ISO string
        const submissionValues: WorkshopFormData = {
          title: values.title,
          description: values.description,
          topic: values.topic,
          objectives: values.objectives,
          linkedSurveyIds: values.linkedSurveyIds || [],
          targetAudience: values.targetAudience,
          expectedSize: values.expectedSize,
          scheduledDate: new Date(values.scheduledDate).toISOString(),
          duration: values.duration,
          location: values.location || undefined,
        }

        if (id) {
          await dispatch(updateWorkshop({ id, updates: submissionValues })).unwrap()
          toast.success(MESSAGES.SUCCESS.UPDATED)
        } else {
          await dispatch(createWorkshop(submissionValues)).unwrap()
          toast.success(MESSAGES.SUCCESS.CREATED)
        }
        navigate(ROUTES.WORKSHOPS.LIST)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to save workshop'))
      }
    },
    enableReinitialize: true,
  })

  // Load workshop data if editing
  useEffect(() => {
    if (id) {
      dispatch(fetchWorkshopById(id))
    }
  }, [id, dispatch])

  // Update form when workshop data loads
  useEffect(() => {
    if (id && currentWorkshop && currentWorkshop.id === id) {
      formik.setValues({
        title: currentWorkshop.title,
        description: currentWorkshop.description,
        topic: currentWorkshop.topic,
        objectives: currentWorkshop.objectives,
        linkedSurveyIds: currentWorkshop.linkedSurveyIds,
        targetAudience: currentWorkshop.targetAudience,
        expectedSize: currentWorkshop.expectedSize,
        scheduledDate: toDateTimeLocal(currentWorkshop.scheduledDate),
        duration: currentWorkshop.duration,
        location: currentWorkshop.location || '',
      })
    }
  }, [id, currentWorkshop])

  const handleAddObjective = () => {
    const newObjective: WorkshopObjective = {
      id: `objective_${Date.now()}`,
      description: '',
      priority: 'medium',
    }
    formik.setFieldValue('objectives', [...formik.values.objectives, newObjective])
  }

  const handleRemoveObjective = (objectiveId: string) => {
    const updated = formik.values.objectives.filter((o) => o.id !== objectiveId)
    formik.setFieldValue('objectives', updated)
  }

  const handleUpdateObjective = (
    objectiveId: string,
    updates: Partial<WorkshopObjective>
  ) => {
    const updated = formik.values.objectives.map((o) =>
      o.id === objectiveId ? { ...o, ...updates } : o
    )
    formik.setFieldValue('objectives', updated)
  }

  const handleToggleSurvey = (surveyId: string) => {
    const current = formik.values.linkedSurveyIds || []
    const updated = current.includes(surveyId)
      ? current.filter((id) => id !== surveyId)
      : [...current, surveyId]
    formik.setFieldValue('linkedSurveyIds', updated)
  }

  return {
    formik,
    isLoading,
    isEditMode: !!id,
    handleAddObjective,
    handleRemoveObjective,
    handleUpdateObjective,
    handleToggleSurvey,
  }
}

