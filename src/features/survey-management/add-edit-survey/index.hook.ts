import { useEffect } from 'react'
import { useFormik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  createSurvey,
  updateSurvey,
  fetchSurveyById,
  selectCurrentSurvey,
} from '../survey-management.slice'
import { createTemplate } from '@/features/survey-templates/survey-templates.slice'
import { initialValues, validationSchema, FormValues } from './index.form'
import { toast } from 'sonner'
import { getErrorMessage } from '@/utils/errorUtil'
import { ROUTES } from '@/routes/route'
import { MESSAGES } from '@/constants/messages'
import { TEMPLATE_CATEGORY } from '@/constants/enums'

export const useAddEditSurveyHook = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const dispatch = useAppDispatch()
  const currentSurvey = useAppSelector(selectCurrentSurvey)
  const isLoading = useAppSelector((state) => state.survey.isLoading)

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (id) {
          await dispatch(updateSurvey({ id, updates: values })).unwrap()
          toast.success(MESSAGES.SUCCESS.UPDATED)
        } else {
          await dispatch(createSurvey(values)).unwrap()
          toast.success(MESSAGES.SUCCESS.CREATED)
        }
        navigate(ROUTES.SURVEYS.LIST)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to save survey'))
      }
    },
    enableReinitialize: true,
  })

  // Load survey data if editing
  useEffect(() => {
    if (id) {
      dispatch(fetchSurveyById(id))
    }
  }, [id, dispatch])

  // Update form when survey data loads
  useEffect(() => {
    if (id && currentSurvey && currentSurvey.id === id) {
      // Convert ISO dates to datetime-local format (YYYY-MM-DDTHH:mm)
      const formatDateForInput = (isoDate: string) => {
        if (!isoDate) return ''
        try {
          const date = new Date(isoDate)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const hours = String(date.getHours()).padStart(2, '0')
          const minutes = String(date.getMinutes()).padStart(2, '0')
          return `${year}-${month}-${day}T${hours}:${minutes}`
        } catch {
          return isoDate
        }
      }

      formik.setValues({
        title: currentSurvey.title,
        purpose: currentSurvey.purpose,
        targetAudience: currentSurvey.targetAudience,
        openDate: formatDateForInput(currentSurvey.openDate),
        closeDate: formatDateForInput(currentSurvey.closeDate),
        questions: currentSurvey.questions,
      })
    }
  }, [id, currentSurvey])

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `question_${Date.now()}`,
      type: 'short_text' as const,
      text: '',
      required: false,
      order: formik.values.questions.length,
    }
    formik.setFieldValue('questions', [...formik.values.questions, newQuestion])
  }

  const handleRemoveQuestion = (questionId: string) => {
    const updated = formik.values.questions.filter((q) => q.id !== questionId)
    // Reorder questions
    const reordered = updated.map((q, index) => ({ ...q, order: index }))
    formik.setFieldValue('questions', reordered)
  }

  const handleUpdateQuestion = (questionId: string, updates: Partial<FormValues['questions'][0]>) => {
    const updated = formik.values.questions.map((q) =>
      q.id === questionId ? { ...q, ...updates } : q
    )
    formik.setFieldValue('questions', updated)
  }

  const handleReorderQuestions = (fromIndex: number, toIndex: number) => {
    const questions = [...formik.values.questions]
    const [moved] = questions.splice(fromIndex, 1)
    questions.splice(toIndex, 0, moved)
    const reordered = questions.map((q, index) => ({ ...q, order: index }))
    formik.setFieldValue('questions', reordered)
  }

  const handleSaveAsTemplate = async () => {
    const templateName = prompt('Enter template name:')
    if (!templateName || !templateName.trim()) {
      return
    }

    const templateDescription = prompt('Enter template description:') || ''

    try {
      await dispatch(
        createTemplate({
          name: templateName.trim(),
          description: templateDescription.trim(),
          category: TEMPLATE_CATEGORY.TRAINING_FEEDBACK, // Default category
          questions: formik.values.questions,
          targetAudience: formik.values.targetAudience,
        })
      ).unwrap()
      toast.success('Template saved successfully')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save template'))
    }
  }

  return {
    formik,
    isLoading,
    isEditMode: !!id,
    handleAddQuestion,
    handleRemoveQuestion,
    handleUpdateQuestion,
    handleReorderQuestions,
    handleSaveAsTemplate,
  }
}

