export const VALIDATION_MESSAGES = {
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email',
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters',
  },
  required: 'This field is required',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
} as const;

export const VALIDATION_LIMITS = {
  email: { maxLength: 254 },
  password: { minLength: 8, maxLength: 128 },
  name: { maxLength: 100 },
  title: { maxLength: 200 },
  text: { maxLength: 5000 },
} as const;

