import { ApiResponse } from '@/constants/types'

/**
 * Extract error message from various error types
 */
export function getErrorMessage(
  errorResponse: unknown,
  defaultMessage = 'An unexpected error occurred.'
): string {
  if (typeof errorResponse === 'string') return errorResponse

  if (errorResponse instanceof Error) return errorResponse.message

  if (typeof errorResponse === 'object' && errorResponse !== null) {
    const apiError = errorResponse as ApiResponse
    if (apiError.error?.message) {
      return apiError.error.message
    }
  }

  return defaultMessage
}

