import { FormikProvider, Form } from 'formik'
import { useRespondHook } from './index.hook'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ErrorMessage } from 'formik'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import QuestionRenderer from './components/question-renderer'
import { SURVEY_STATUS } from '@/constants/enums'
import HelpIcon from '@/components/common/HelpIcon'

export default function RespondPage() {
  const { formik, survey, isLoading, hasSubmitted, handleAnswerChange, getAnswerValue } =
    useRespondHook()

  const { values, errors, touched, isSubmitting } = formik

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Survey Not Found</h1>
          <p className="text-gray-600">The survey you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  // Check survey status and dates
  const now = new Date()
  const openDate = new Date(survey.openDate)
  const closeDate = new Date(survey.closeDate)
  const isOpen = now >= openDate && now <= closeDate

  if (survey.status !== SURVEY_STATUS.PUBLISHED) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Survey Not Available</h1>
          <p className="text-gray-600">
            This survey is {survey.status} and not currently accepting responses.
          </p>
        </div>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Survey Not Available</h1>
          <p className="text-gray-600">
            {now < openDate
              ? 'This survey has not opened yet.'
              : 'This survey has closed and is no longer accepting responses.'}
          </p>
        </div>
      </div>
    )
  }

  if (hasSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
              <p className="text-gray-600 mb-4">
                Your response has been submitted successfully.
              </p>
              <p className="text-sm text-gray-500">
                We appreciate your feedback.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{survey.title}</CardTitle>
            <p className="text-gray-600 mt-2">{survey.purpose}</p>
          </CardHeader>
          <CardContent>
            <FormikProvider value={formik}>
              <Form className="space-y-6">
                {/* Questions */}
                <div className="space-y-6">
                  {survey.questions.map((question, index) => (
                    <Card key={question.id} className="bg-white">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-baseline gap-3">
                            <span className="text-sm font-medium text-gray-500 leading-none shrink-0">
                              Q{index + 1}.
                            </span>
                            <div className="flex-1 min-w-0">
                              <QuestionRenderer
                                question={question}
                                value={getAnswerValue(question.id)}
                                onChange={(value) => handleAnswerChange(question.id, value)}
                                error={
                                  Array.isArray(errors.answers) &&
                                  formik.values.answers.findIndex(
                                    (a) => a.questionId === question.id
                                  ) >= 0
                                    ? (errors.answers[
                                        formik.values.answers.findIndex(
                                          (a) => a.questionId === question.id
                                        )
                                      ] as any)?.value || undefined
                                    : undefined
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Anonymous Response Option */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="anonymous"
                          checked={values.anonymous}
                          onCheckedChange={(checked) => formik.setFieldValue('anonymous', checked === true)}
                        />
                        <Label htmlFor="anonymous" className="font-normal cursor-pointer">
                          Submit anonymously
                        </Label>
                        <HelpIcon content="Your name and email will not be associated with your response. You may still need to provide an email to prevent duplicate submissions." />
                      </div>

                      {values.anonymous && (
                        <div className="space-y-3 pl-6">
                          <div className="space-y-2">
                            <Label htmlFor="respondentName">Name (Optional)</Label>
                            <Input
                              id="respondentName"
                              name="respondentName"
                              value={values.respondentName || ''}
                              onChange={formik.handleChange}
                              placeholder="Your name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="respondentEmail">
                              Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="respondentEmail"
                              name="respondentEmail"
                              type="email"
                              value={values.respondentEmail || ''}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder="your.email@example.com"
                              className={
                                errors.respondentEmail && touched.respondentEmail
                                  ? 'shadow-md shadow-destructive/50'
                                  : ''
                              }
                            />
                            <ErrorMessage name="respondentEmail">
                              {(msg) => (
                                <div className="text-sm text-destructive flex items-center gap-1">
                                  <span>{msg}</span>
                                </div>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-4 pt-4">
                  <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-32">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Response'
                    )}
                  </Button>
                </div>
              </Form>
            </FormikProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

