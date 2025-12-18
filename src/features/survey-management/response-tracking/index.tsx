import { useNavigate } from 'react-router-dom'
import { useResponseTrackingHook } from './index.hook'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Users, UserCheck, Eye, TrendingUp } from 'lucide-react'
import { ROUTES } from '@/routes/route'
import ResponseTrackingSkeleton from './index.skeleton'

export default function ResponseTracking() {
  const navigate = useNavigate()
  const {
    survey,
    responses,
    isLoading,
    stats,
    filterTeam,
    setFilterTeam,
    filterDepartment,
    setFilterDepartment,
    availableTeams,
    availableDepartments,
  } = useResponseTrackingHook()

  if (isLoading || !survey) {
    return <ResponseTrackingSkeleton />
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Response Tracking
          </h1>
          <p className="text-gray-600 mt-1">{survey.title}</p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.SURVEYS.LIST)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Surveys
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold mt-1">{stats.totalResponses}</p>
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
                <p className="text-2xl font-bold mt-1">{stats.responseRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Named Responses</p>
                <p className="text-2xl font-bold mt-1">{stats.namedCount}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Anonymous</p>
                <p className="text-2xl font-bold mt-1">{stats.anonymousCount}</p>
              </div>
              <Eye className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {(availableTeams.length > 0 || availableDepartments.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {availableTeams.length > 0 && (
                <div className="space-y-2">
                  <Label>Team</Label>
                  <Select value={filterTeam} onValueChange={setFilterTeam}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Teams" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teams</SelectItem>
                      {availableTeams.map((team) => (
                        <SelectItem key={team} value={team}>
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {availableDepartments.length > 0 && (
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {availableDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response List */}
      <Card>
        <CardHeader>
          <CardTitle>Responses ({responses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {responses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No responses yet</p>
              <p className="text-sm mt-2">Share the survey link to start collecting responses</p>
            </div>
          ) : (
            <div className="space-y-4">
              {responses.map((response) => (
                <div
                  key={response.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {response.anonymous ? (
                          <>
                            <span className="text-sm font-medium text-gray-600">Anonymous</span>
                            {response.respondentName && (
                              <span className="text-sm text-gray-500">
                                ({response.respondentName})
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-sm font-medium">
                            User ID: {response.userId || 'Unknown'}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            response.anonymous
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {response.anonymous ? 'Anonymous' : 'Named'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Submitted: {formatDate(response.submittedAt)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Answers: {response.answers.length} / {survey.questions.length}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(ROUTES.SURVEYS.RESULTS.replace(':id', survey.id))}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Results
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

