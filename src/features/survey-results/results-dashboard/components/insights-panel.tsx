import { Insight } from '../../survey-results.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, TrendingDown, Lightbulb, MessageSquare, TrendingUp } from 'lucide-react'

interface InsightsPanelProps {
  insights: Insight[]
}

const getInsightIcon = (type: Insight['type']) => {
  switch (type) {
    case 'pain_point':
      return <AlertTriangle className="w-5 h-5 text-red-500" />
    case 'low_score':
      return <TrendingDown className="w-5 h-5 text-orange-500" />
    case 'requested_topic':
      return <Lightbulb className="w-5 h-5 text-blue-500" />
    case 'suggestion':
      return <MessageSquare className="w-5 h-5 text-purple-500" />
    case 'trend':
      return <TrendingUp className="w-5 h-5 text-green-500" />
    default:
      return <Lightbulb className="w-5 h-5 text-gray-500" />
  }
}

const getSeverityColor = (severity?: Insight['severity']) => {
  switch (severity) {
    case 'high':
      return 'bg-red-50 shadow-sm shadow-red-200/50'
    case 'medium':
      return 'bg-orange-50 shadow-sm shadow-orange-200/50'
    case 'low':
      return 'bg-yellow-50 shadow-sm shadow-yellow-200/50'
    default:
      return 'bg-gray-50 shadow-sm shadow-gray-200/50'
  }
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No insights available. More responses needed to generate insights.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group insights by type
  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.type]) {
      acc[insight.type] = []
    }
    acc[insight.type].push(insight)
    return acc
  }, {} as Record<Insight['type'], Insight[]>)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Insights</CardTitle>
        <p className="text-sm text-gray-500">
          {insights.length} insight{insights.length !== 1 ? 's' : ''} identified
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedInsights).map(([type, typeInsights]) => (
            <div key={type} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 capitalize">
                {type.replace('_', ' ')}
              </h3>
              {typeInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${getSeverityColor(insight.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

