import * as Yup from 'yup'
import { VALIDATION_MESSAGES } from '@/constants/validation'

export const validationSchema = Yup.object({
  email: Yup.string()
    .email(VALIDATION_MESSAGES.email.invalid)
    .required(VALIDATION_MESSAGES.email.required),
  password: Yup.string()
    .min(8, VALIDATION_MESSAGES.password.minLength)
    .required(VALIDATION_MESSAGES.password.required),
})

export type FormValues = Yup.InferType<typeof validationSchema>

export const initialValues: FormValues = {
  email: '',
  password: '',
}

