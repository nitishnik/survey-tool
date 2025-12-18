import * as Yup from 'yup'
import { VALIDATION_MESSAGES } from '@/constants/validation'
import { ResponseFormData } from '../survey-response.types'

export const createValidationSchema = (requiredQuestionIds: string[]) => {
  const answerSchema = Yup.object({
    questionId: Yup.string().required(),
    value: Yup.mixed().required(VALIDATION_MESSAGES.required),
  })

  return Yup.object({
    answers: Yup.array()
      .of(answerSchema)
      .test('required-questions', 'Please answer all required questions', function (answers) {
        if (!answers) return false
        const answeredQuestionIds = answers.map((a) => a.questionId)
        const allRequiredAnswered = requiredQuestionIds.every((id) =>
          answeredQuestionIds.includes(id)
        )
        return allRequiredAnswered
      })
      .min(requiredQuestionIds.length, 'Please answer all required questions')
      .required(),
    anonymous: Yup.boolean().required(),
    respondentName: Yup.string().when('anonymous', {
      is: true,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.optional(),
    }),
    respondentEmail: Yup.string().when('anonymous', {
      is: true,
      then: (schema) =>
        schema
          .email(VALIDATION_MESSAGES.email.invalid)
          .required('Email is required for anonymous responses'),
      otherwise: (schema) => schema.optional(),
    }),
  })
}

export type FormValues = Yup.InferType<ReturnType<typeof createValidationSchema>>

export const initialValues: ResponseFormData = {
  answers: [],
  anonymous: false,
  respondentName: '',
  respondentEmail: '',
}

