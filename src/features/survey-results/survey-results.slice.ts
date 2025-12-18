import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SurveyAnalytics, QuestionStatistics, Insight } from './survey-results.types'
import { Survey } from '@/features/survey-management/survey-management.types'
import { SurveyResponse } from '@/features/survey-response/survey-response.types'
import { QUESTION_TYPE } from '@/constants/enums'
import localStorageService from '@/services/localStorageService'
import type { RootState } from '@/store'

interface ResultsState {
  analytics: SurveyAnalytics | null
  isLoading: boolean
  error: string | null
}

const initialState: ResultsState = {
  analytics: null,
  isLoading: false,
  error: null,
}

// Helper function to calculate question statistics
const calculateQuestionStatistics = (
  question: { id: string; text: string; type: QUESTION_TYPE; options?: string[] },
  responses: SurveyResponse[]
): QuestionStatistics => {
  const questionResponses = responses
    .map((r) => r.answers.find((a) => a.questionId === question.id))
    .filter((a) => a !== undefined && a.value !== undefined && a.value !== null && a.value !== '')

  const totalResponses = questionResponses.length

  const stats: QuestionStatistics = {
    questionId: question.id,
    questionText: question.text,
    questionType: question.type,
    totalResponses,
    responseRate: totalResponses > 0 ? 100 : 0,
  }

  switch (question.type) {
    case QUESTION_TYPE.MULTIPLE_CHOICE:
      const optionCounts: Record<string, number> = {}
      question.options?.forEach((opt) => {
        optionCounts[opt] = 0
      })
      questionResponses.forEach((answer) => {
        // Handle both string and string[] values
        let value: string | undefined
        if (typeof answer?.value === 'string') {
          value = answer.value
        } else if (Array.isArray(answer?.value) && answer.value.length > 0) {
          value = answer.value[0] // Take first option if array
        }
        if (value && optionCounts[value] !== undefined) {
          optionCounts[value] = (optionCounts[value] || 0) + 1
        }
      })
      stats.optionCounts = optionCounts
      break

    case QUESTION_TYPE.RATING_SCALE:
      const ratings = questionResponses
        .map((a) => a?.value as number)
        .filter((v) => typeof v === 'number' && v > 0)
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, val) => acc + val, 0)
        stats.averageRating = Math.round((sum / ratings.length) * 10) / 10

        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        ratings.forEach((rating) => {
          if (rating >= 1 && rating <= 5) {
            distribution[rating] = (distribution[rating] || 0) + 1
          }
        })
        stats.ratingDistribution = distribution
      }
      break

    case QUESTION_TYPE.SHORT_TEXT:
    case QUESTION_TYPE.LONG_TEXT:
      stats.textResponses = questionResponses
        .map((a) => a?.value as string)
        .filter((v) => typeof v === 'string' && v.trim().length > 0)
      break
  }

  return stats
}

// Helper function to extract insights
const extractInsights = (
  questionStats: QuestionStatistics[]
): Insight[] => {
  const insights: Insight[] = []

  // Low scores (rating < 3)
  questionStats.forEach((stat) => {
    if (stat.questionType === QUESTION_TYPE.RATING_SCALE && stat.averageRating) {
      if (stat.averageRating < 3) {
        insights.push({
          type: 'low_score',
          title: 'Low Rating Detected',
          description: `Question "${stat.questionText}" has an average rating of ${stat.averageRating}/5`,
          questionId: stat.questionId,
          severity: stat.averageRating < 2 ? 'high' : 'medium',
        })
      }
    }
  })

  // Common pain points (text analysis - simple keyword detection)
  questionStats.forEach((stat) => {
    if (stat.textResponses && stat.textResponses.length > 0) {
      const painKeywords = ['problem', 'issue', 'difficult', 'challenge', 'struggle', 'frustrated']
      const painCount = stat.textResponses.filter((text) =>
        painKeywords.some((keyword) => text.toLowerCase().includes(keyword))
      ).length

      if (painCount > stat.textResponses.length * 0.3) {
        insights.push({
          type: 'pain_point',
          title: 'Common Pain Point',
          description: `${Math.round((painCount / stat.textResponses.length) * 100)}% of responses mention pain points in "${stat.questionText}"`,
          questionId: stat.questionId,
          severity: painCount > stat.textResponses.length * 0.5 ? 'high' : 'medium',
        })
      }
    }
  })

  // Requested topics (text analysis)
  questionStats.forEach((stat) => {
    if (stat.textResponses && stat.textResponses.length > 0) {
      const requestKeywords = ['need', 'want', 'would like', 'should', 'recommend', 'suggest']
      const requestCount = stat.textResponses.filter((text) =>
        requestKeywords.some((keyword) => text.toLowerCase().includes(keyword))
      ).length

      if (requestCount > stat.textResponses.length * 0.2) {
        insights.push({
          type: 'requested_topic',
          title: 'Topic Requests',
          description: `${Math.round((requestCount / stat.textResponses.length) * 100)}% of responses request topics in "${stat.questionText}"`,
          questionId: stat.questionId,
          severity: 'medium',
        })
      }
    }
  })

  return insights
}

export const calculateAnalytics = createAsyncThunk(
  'results/calculateAnalytics',
  async (surveyId: string, { rejectWithValue }) => {
    try {
      const survey = localStorageService.getById<Survey>('SURVEYS', surveyId)
      if (!survey) {
        return rejectWithValue('Survey not found')
      }

      const allResponses = localStorageService.getAll<SurveyResponse>('RESPONSES')
      const responses = allResponses.filter((r) => r.surveyId === surveyId)

      // Calculate question statistics (works even with 0 responses)
      const questionStatistics = survey.questions.map((question) =>
        calculateQuestionStatistics(question, responses)
      )

      // Calculate overall statistics
      const totalResponses = responses.length
      const requiredQuestionIds = survey.questions.filter((q) => q.required).map((q) => q.id)
      const completedResponses = responses.filter((r) => {
        // Check if all required questions are answered
        const answeredQuestionIds = r.answers.map((a) => a.questionId)
        return requiredQuestionIds.every((id) => answeredQuestionIds.includes(id))
      }).length
      const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0

      // Mock response rate (would need actual target audience count)
      const responseRate = totalResponses > 0 ? Math.min(100, (totalResponses / 50) * 100) : 0

      // Extract insights (only if there are responses)
      const insights = totalResponses > 0 ? extractInsights(questionStatistics) : []

      const analytics: SurveyAnalytics = {
        surveyId,
        totalResponses,
        responseRate: Math.round(responseRate),
        completionRate: Math.round(completionRate),
        questionStatistics,
        insights,
      }

      return analytics
    } catch (error) {
      return rejectWithValue('Failed to calculate analytics')
    }
  }
)

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.analytics = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateAnalytics.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(calculateAnalytics.fulfilled, (state, action) => {
        state.isLoading = false
        state.analytics = action.payload
      })
      .addCase(calculateAnalytics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearAnalytics, clearError } = resultsSlice.actions

export const selectAnalytics = (state: RootState) => state.results.analytics
export const selectIsLoading = (state: RootState) => state.results.isLoading

export default resultsSlice.reducer

