import * as XLSX from 'xlsx'
import { SurveyAnalytics } from '@/features/survey-results/survey-results.types'
import { Survey } from '@/features/survey-management/survey-management.types'
import { SurveyResponse } from '@/features/survey-response/survey-response.types'
import localStorageService from '@/services/localStorageService'

export const exportSurveyResults = (
  surveyId: string,
  analytics: SurveyAnalytics,
  survey: Survey
) => {
  try {
    // Get all responses
    const allResponses = localStorageService.getAll<SurveyResponse>('RESPONSES')
    const responses = allResponses.filter((r) => r.surveyId === surveyId)

    // Create workbook
    const workbook = XLSX.utils.book_new()

    // Sheet 1: Summary Statistics
    const summaryData = [
      ['Survey Title', survey.title],
      ['Survey Purpose', survey.purpose],
      ['Total Responses', analytics.totalResponses],
      ['Response Rate', `${analytics.responseRate}%`],
      ['Completion Rate', `${analytics.completionRate}%`],
      ['Generated At', new Date().toISOString()],
    ]
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

    // Sheet 2: Question Statistics
    const questionStatsData = [
      [
        'Question',
        'Type',
        'Total Responses',
        'Response Rate',
        'Average Rating',
        'Top Option',
      ],
    ]

    analytics.questionStatistics.forEach((stat) => {
      let topOption = 'N/A'
      if (stat.optionCounts) {
        const entries = Object.entries(stat.optionCounts)
        if (entries.length > 0) {
          const sorted = entries.sort((a, b) => b[1] - a[1])
          topOption = `${sorted[0][0]} (${sorted[0][1]})`
        }
      }

        questionStatsData.push([
        stat.questionText,
        stat.questionType,
        String(stat.totalResponses),
        `${stat.responseRate}%`,
        stat.averageRating?.toString() || 'N/A',
        topOption,
      ])
    })

    const questionStatsSheet = XLSX.utils.aoa_to_sheet(questionStatsData)
    XLSX.utils.book_append_sheet(workbook, questionStatsSheet, 'Question Statistics')

    // Sheet 3: Raw Responses
    const rawDataHeaders = [
      'Response ID',
      'Submitted At',
      'Anonymous',
      'Respondent Name',
      'Respondent Email',
      ...survey.questions.map((q) => q.text),
    ]

    const rawData = [rawDataHeaders]

    responses.forEach((response) => {
      const row = [
        response.id,
        response.submittedAt,
        response.anonymous ? 'Yes' : 'No',
        response.respondentName || 'N/A',
        response.respondentEmail || 'N/A',
      ]

      survey.questions.forEach((question) => {
        const answer = response.answers.find((a) => a.questionId === question.id)
        if (answer) {
          if (Array.isArray(answer.value)) {
            row.push(answer.value.join(', '))
          } else {
            row.push(String(answer.value))
          }
        } else {
          row.push('')
        }
      })

      rawData.push(row)
    })

    const rawDataSheet = XLSX.utils.aoa_to_sheet(rawData)
    XLSX.utils.book_append_sheet(workbook, rawDataSheet, 'Raw Responses')

    // Sheet 4: Insights
    const insightsData = [
      ['Type', 'Title', 'Description', 'Severity', 'Question ID'],
    ]

    analytics.insights.forEach((insight) => {
      insightsData.push([
        insight.type,
        insight.title,
        insight.description,
        insight.severity || 'N/A',
        insight.questionId || 'N/A',
      ])
    })

    const insightsSheet = XLSX.utils.aoa_to_sheet(insightsData)
    XLSX.utils.book_append_sheet(workbook, insightsSheet, 'Insights')

    // Generate filename
    const filename = `survey-results-${survey.title.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().split('T')[0]}.xlsx`

    // Write file
    XLSX.writeFile(workbook, filename)

    return true
  } catch (error) {
    console.error('Export error:', error)
    throw new Error('Failed to export survey results')
  }
}

export const exportSurveyResultsCSV = (
  surveyId: string,
  survey: Survey
) => {
  try {
    // Get all responses
    const allResponses = localStorageService.getAll<SurveyResponse>('RESPONSES')
    const responses = allResponses.filter((r) => r.surveyId === surveyId)

    // Create CSV content
    const headers = [
      'Response ID',
      'Submitted At',
      'Anonymous',
      'Respondent Name',
      'Respondent Email',
      ...survey.questions.map((q) => q.text),
    ]

    const rows = responses.map((response) => {
      const row = [
        response.id,
        response.submittedAt,
        response.anonymous ? 'Yes' : 'No',
        response.respondentName || '',
        response.respondentEmail || '',
      ]

      survey.questions.forEach((question) => {
        const answer = response.answers.find((a) => a.questionId === question.id)
        if (answer) {
          if (Array.isArray(answer.value)) {
            row.push(answer.value.join(', '))
          } else {
            row.push(String(answer.value))
          }
        } else {
          row.push('')
        }
      })

      return row
    })

    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `survey-results-${survey.title.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().split('T')[0]}.csv`
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error('Export error:', error)
    throw new Error('Failed to export survey results')
  }
}

