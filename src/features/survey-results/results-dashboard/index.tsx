import { useNavigate } from 'react-router-dom'
import { useResultsDashboardHook } from './index.hook'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Download, Users, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react'
import { ROUTES } from '@/routes/route'
import ResultsDashboardSkeleton from './index.skeleton'
import { QuestionChart } from './components/chart-components'
import InsightsPanel from './components/insights-panel'
import { exportSurveyResults } from '@/utils/exportUtil'
import { toast } from 'sonner'

export default function ResultsDashboard() {
  const navigate = useNavigate()
  const { analytics, survey, isLoading, surveyId } = useResultsDashboardHook()

  const handleExport = () => {
    if (surveyId && analytics && survey) {
      try {
        exportSurveyResults(surveyId, analytics, survey)
        toast.success('Survey results exported successfully')
      } catch (error) {
        toast.error('Failed to export survey results')
      }
    }
  }

  if (isLoading || !survey) {
    return <ResultsDashboardSkeleton />
  }

  // Handle case when analytics calculation fails
  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Survey Results
            </h1>
            <p className="text-gray-600 mt-1">{survey.title}</p>
          </div>
          <Button variant="outline" onClick={() => navigate(ROUTES.SURVEYS.LIST)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to Load Results</h2>
            <p className="text-gray-500 mb-4">
              There was an error loading the survey results. Please try again.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Handle empty responses
  if (analytics.totalResponses === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Survey Results
            </h1>
            <p className="text-gray-600 mt-1">{survey.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport} disabled>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => navigate(ROUTES.SURVEYS.LIST)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Results Available</h2>
            <p className="text-gray-500 mb-4">
              This survey has no responses yet. Share the survey to start collecting responses.
            </p>
            <Button variant="outline" onClick={() => navigate(ROUTES.SURVEYS.TRACKING.replace(':id', survey.id || ''))}>
              View Tracking
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Survey Results
          </h1>
          <p className="text-gray-600 mt-1">{survey.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => navigate(ROUTES.SURVEYS.LIST)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold mt-1">{analytics.totalResponses}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold mt-1">{analytics.responseRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold mt-1">{analytics.completionRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Insights</p>
                <p className="text-2xl font-bold mt-1">{analytics.insights.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Panel */}
      <InsightsPanel insights={analytics.insights} />

      {/* Question Charts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Question Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analytics.questionStatistics.map((questionStat) => (
            <QuestionChart key={questionStat.questionId} questionStats={questionStat} />
          ))}
        </div>
      </div>
    </div>
  )
}

