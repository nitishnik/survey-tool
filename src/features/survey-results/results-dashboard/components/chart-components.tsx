import { QuestionStatistics } from '../../survey-results.types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { QUESTION_TYPE } from '@/constants/enums'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartComponentsProps {
  questionStats: QuestionStatistics
}

export function MultipleChoiceChart({ questionStats }: ChartComponentsProps) {
  if (!questionStats.optionCounts) return null

  const data = Object.entries(questionStats.optionCounts).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{questionStats.questionText}</CardTitle>
        <p className="text-sm text-gray-500">Total Responses: {questionStats.totalResponses}</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function RatingScaleChart({ questionStats }: ChartComponentsProps) {
  if (!questionStats.ratingDistribution) return null

  const data = Object.entries(questionStats.ratingDistribution)
    .map(([rating, count]) => ({
      rating: `Rating ${rating}`,
      count,
    }))
    .sort((a, b) => parseInt(a.rating.split(' ')[1]) - parseInt(b.rating.split(' ')[1]))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{questionStats.questionText}</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <p className="text-gray-500">Total Responses: {questionStats.totalResponses}</p>
          {questionStats.averageRating && (
            <p className="font-medium text-primary">
              Average: {questionStats.averageRating}/5
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function TextResponsesSummary({ questionStats }: ChartComponentsProps) {
  if (!questionStats.textResponses || questionStats.textResponses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{questionStats.questionText}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No text responses available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{questionStats.questionText}</CardTitle>
        <p className="text-sm text-gray-500">
          Total Responses: {questionStats.textResponses.length}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {questionStats.textResponses.slice(0, 10).map((response, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm">{response}</p>
            </div>
          ))}
          {questionStats.textResponses.length > 10 && (
            <p className="text-sm text-gray-500 text-center">
              ... and {questionStats.textResponses.length - 10} more responses
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function QuestionChart({ questionStats }: ChartComponentsProps) {
  switch (questionStats.questionType) {
    case QUESTION_TYPE.MULTIPLE_CHOICE:
      return <MultipleChoiceChart questionStats={questionStats} />
    case QUESTION_TYPE.RATING_SCALE:
      return <RatingScaleChart questionStats={questionStats} />
    case QUESTION_TYPE.SHORT_TEXT:
    case QUESTION_TYPE.LONG_TEXT:
      return <TextResponsesSummary questionStats={questionStats} />
    default:
      return null
  }
}

