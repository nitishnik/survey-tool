import * as Yup from 'yup'
import { VALIDATION_MESSAGES } from '@/constants/validation'

const objectiveSchema = Yup.object({
  id: Yup.string().required(),
  description: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .min(3, 'Objective description must be at least 3 characters')
    .max(500, VALIDATION_MESSAGES.maxLength(500)),
  priority: Yup.string().oneOf(['high', 'medium', 'low']).required(),
})

export const validationSchema = Yup.object({
  title: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .max(200, VALIDATION_MESSAGES.maxLength(200)),
  description: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .max(1000, VALIDATION_MESSAGES.maxLength(1000)),
  topic: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .max(200, VALIDATION_MESSAGES.maxLength(200)),
  objectives: Yup.array()
    .of(objectiveSchema)
    .min(1, 'At least one objective is required')
    .required(),
  linkedSurveyIds: Yup.array().of(Yup.string().required()),
  targetAudience: Yup.object({
    teams: Yup.array().of(Yup.string().required()),
    departments: Yup.array().of(Yup.string().required()),
    roles: Yup.array().of(Yup.string().required()),
    locations: Yup.array().of(Yup.string().required()),
  }).test(
    'at-least-one-audience',
    'At least one target audience group must be selected.',
    (value) =>
      (value.teams && value.teams.length > 0) ||
      (value.departments && value.departments.length > 0) ||
      (value.roles && value.roles.length > 0) ||
      (value.locations && value.locations.length > 0)
  ).required(),
  expectedSize: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .min(1, 'Expected size must be at least 1')
    .max(1000, 'Expected size cannot exceed 1000'),
  scheduledDate: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .test('is-future', 'Scheduled date must be in the future', function (value) {
      if (!value) return true
      return new Date(value) > new Date()
    }),
  duration: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .min(15, 'Duration must be at least 15 minutes')
    .max(480, 'Duration cannot exceed 8 hours (480 minutes)'),
  location: Yup.string().max(200, VALIDATION_MESSAGES.maxLength(200)),
})

export type FormValues = Yup.InferType<typeof validationSchema>

export const initialValues: FormValues = {
  title: '',
  description: '',
  topic: '',
  objectives: [],
  linkedSurveyIds: [],
  targetAudience: {
    teams: [],
    departments: [],
    roles: [],
    locations: [],
  },
  expectedSize: 20,
  scheduledDate: '',
  duration: 60,
  location: '',
}

