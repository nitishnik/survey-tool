import * as Yup from 'yup'
import { VALIDATION_MESSAGES } from '@/constants/validation'
import { QUESTION_TYPE } from '@/constants/enums'

const questionSchema = Yup.object({
  id: Yup.string().required(),
  type: Yup.string().oneOf(Object.values(QUESTION_TYPE)).required(),
  text: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .max(500, VALIDATION_MESSAGES.maxLength(500)),
  options: Yup.array().when('type', {
    is: QUESTION_TYPE.MULTIPLE_CHOICE,
    then: (schema) => schema.min(2, 'At least 2 options required').required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  required: Yup.boolean().required(),
  order: Yup.number().required(),
})

export const validationSchema = Yup.object({
  title: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .max(200, VALIDATION_MESSAGES.maxLength(200)),
  purpose: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .max(1000, VALIDATION_MESSAGES.maxLength(1000)),
  targetAudience: Yup.object({
    teams: Yup.array().of(Yup.string().required()).optional(),
    departments: Yup.array().of(Yup.string().required()).optional(),
    roles: Yup.array().of(Yup.string().required()).optional(),
    locations: Yup.array().of(Yup.string().required()).optional(),
  })
    .required()
    .test('has-audience', 'At least one target audience group must be selected', function (value) {
      if (!value) return false
      const { teams, departments, roles, locations } = value
      const totalCount =
        (teams?.length || 0) +
        (departments?.length || 0) +
        (roles?.length || 0) +
        (locations?.length || 0)
      return totalCount > 0
    }),
  openDate: Yup.string().required(VALIDATION_MESSAGES.required),
  closeDate: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .test('is-after-open', 'Close date must be after open date', function (value) {
      const { openDate } = this.parent
      if (!value || !openDate) return true
      return new Date(value) > new Date(openDate)
    }),
  questions: Yup.array()
    .of(questionSchema)
    .min(1, 'At least one question is required')
    .required(),
})

export type FormValues = Yup.InferType<typeof validationSchema>

export const initialValues: FormValues = {
  title: '',
  purpose: '',
  targetAudience: {
    teams: [],
    departments: [],
    roles: [],
    locations: [],
  },
  openDate: '',
  closeDate: '',
  questions: [],
}

