import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  fetchSurveyById,
  selectCurrentSurvey,
  selectSurveyById,
} from '@/features/survey-management/survey-management.slice'
import { submitResponse } from '../survey-response.slice'
import { createValidationSchema, initialValues, FormValues } from './index.form'
import { toast } from 'sonner'
import { getErrorMessage } from '@/utils/errorUtil'
import { MESSAGES } from '@/constants/messages'
import { Answer } from '../survey-response.types'

export const useRespondHook = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const survey = useAppSelector((state) =>
    id ? selectSurveyById(id)(state) : undefined
  )
  const currentSurvey = useAppSelector(selectCurrentSurvey)
  const isLoading = useAppSelector((state) => state.survey.isLoading)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const activeSurvey = survey || currentSurvey

  // Check if already submitted
  useEffect(() => {
    if (id) {
      const submissionKey = `survey_submission_${id}`
      const submitted = localStorage.getItem(submissionKey)
      if (submitted) {
        setHasSubmitted(true)
      }
    }
  }, [id])

  // Load survey data
  useEffect(() => {
    if (id && !survey) {
      dispatch(fetchSurveyById(id))
    }
  }, [id, survey, dispatch])

  // Check if survey is accessible (status and dates)
  const isAccessible =
    activeSurvey?.status === 'published' &&
    !hasSubmitted &&
    new Date(activeSurvey.openDate) <= new Date() &&
    new Date(activeSurvey.closeDate) >= new Date()

  const requiredQuestionIds =
    activeSurvey?.questions.filter((q) => q.required).map((q) => q.id) || []

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema: createValidationSchema(requiredQuestionIds),
    onSubmit: async (values) => {
      if (!id || !activeSurvey) {
        toast.error('Survey not found')
        return
      }

      try {
        // Map answers to question IDs - only include questions that have answers
        const answers: Answer[] = activeSurvey.questions
          .map((question) => {
            const answer = values.answers.find((a) => a.questionId === question.id)
            if (!answer || answer.value === undefined || answer.value === null) {
              return null
            }
            // Check if value is empty
            if (
              typeof answer.value === 'string' &&
              answer.value.trim() === ''
            ) {
              return null
            }
            if (
              Array.isArray(answer.value) &&
              answer.value.length === 0
            ) {
              return null
            }
            return {
              questionId: question.id,
              value: answer.value as string | number | string[],
            }
          })
          .filter((answer): answer is Answer => answer !== null)

        await dispatch(
          submitResponse({
            surveyId: id,
            responseData: {
              ...values,
              answers,
            },
          })
        ).unwrap()

        toast.success(MESSAGES.SUCCESS.SUBMITTED)
        setHasSubmitted(true)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to submit response'))
      }
    },
    enableReinitialize: true,
  })

  const handleAnswerChange = (questionId: string, value: string | number | string[]) => {
    const existingIndex = formik.values.answers.findIndex(
      (a) => a.questionId === questionId
    )
    const newAnswer: Answer = { questionId, value: value as string | number | string[] }

    if (existingIndex >= 0) {
      const updated = [...formik.values.answers]
      updated[existingIndex] = newAnswer
      formik.setFieldValue('answers', updated)
    } else {
      formik.setFieldValue('answers', [...formik.values.answers, newAnswer])
    }
  }

  const getAnswerValue = (questionId: string): string | number | string[] | undefined => {
    const answer = formik.values.answers.find((a) => a.questionId === questionId)
    return answer?.value as string | number | string[] | undefined
  }

  return {
    formik,
    survey: activeSurvey,
    isLoading,
    hasSubmitted,
    isAccessible,
    handleAnswerChange,
    getAnswerValue,
  }
}

