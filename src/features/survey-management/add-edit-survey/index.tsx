import { FormikProvider, Form } from 'formik'
import { useAddEditSurveyHook } from './index.hook'
import { Button } from '@/components/ui/button'
import Breadcrumb, { BreadcrumbItem } from '@/components/common/breadcrumb'
import { ROUTES } from '@/routes/route'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ErrorMessage } from 'formik'
import { ArrowLeft, Save, FileStack } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TargetAudienceSelector from './components/target-audience-selector'
import QuestionBuilder from './components/question-builder'
import AddEditSurveySkeleton from './index.skeleton'

export default function AddEditSurvey() {
  const navigate = useNavigate()
  const {
    formik,
    isLoading,
    isEditMode,
    handleAddQuestion,
    handleRemoveQuestion,
    handleUpdateQuestion,
    handleReorderQuestions,
    handleSaveAsTemplate,
  } = useAddEditSurveyHook()

  const { values, errors, touched, isSubmitting } = formik

  if (isLoading && isEditMode) {
    return <AddEditSurveySkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbItem>
          <button
            onClick={() => navigate(ROUTES.SURVEYS.LIST)}
            className="text-primary hover:underline"
          >
            Surveys
          </button>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          {isEditMode ? 'Edit Survey' : 'Create Survey'}
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {isEditMode ? 'Edit Survey' : 'Create New Survey'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? 'Update your survey details and questions'
              : 'Build a new survey to collect feedback from your team'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.SURVEYS.LIST)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <FormikProvider value={formik}>
        <Form className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Survey Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter survey title"
                  className={errors.title && touched.title ? 'shadow-md shadow-destructive/50' : ''}
                />
                <ErrorMessage name="title">
                  {(msg) => (
                    <div className="text-sm text-destructive flex items-center gap-1">
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">
                  Purpose <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={values.purpose}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Describe the purpose of this survey"
                  rows={4}
                  className={errors.purpose && touched.purpose ? 'shadow-md shadow-destructive/50' : ''}
                />
                <ErrorMessage name="purpose">
                  {(msg) => (
                    <div className="text-sm text-destructive flex items-center gap-1">
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
            </CardHeader>
            <CardContent>
              <TargetAudienceSelector
                value={values.targetAudience}
                onChange={(audience) => formik.setFieldValue('targetAudience', audience)}
                errors={errors.targetAudience}
                touched={touched.targetAudience}
              />
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openDate">
                    Open Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="openDate"
                    name="openDate"
                    type="datetime-local"
                    value={values.openDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={errors.openDate && touched.openDate ? 'shadow-md shadow-destructive/50' : ''}
                  />
                  <ErrorMessage name="openDate">
                    {(msg) => (
                      <div className="text-sm text-destructive flex items-center gap-1">
                        <span>{msg}</span>
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closeDate">
                    Close Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="closeDate"
                    name="closeDate"
                    type="datetime-local"
                    value={values.closeDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={errors.closeDate && touched.closeDate ? 'shadow-md shadow-destructive/50' : ''}
                  />
                  <ErrorMessage name="closeDate">
                    {(msg) => (
                      <div className="text-sm text-destructive flex items-center gap-1">
                        <span>{msg}</span>
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionBuilder
                questions={values.questions}
                onAdd={handleAddQuestion}
                onRemove={handleRemoveQuestion}
                onUpdate={handleUpdateQuestion}
                onReorder={handleReorderQuestions}
                errors={errors.questions}
                touched={touched.questions}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.SURVEYS.LIST)}
            >
              Cancel
            </Button>
            {formik.values.questions.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveAsTemplate}
                className="flex items-center gap-2"
              >
                <FileStack className="w-4 h-4" />
                Save as Template
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Survey' : 'Create Survey'}
            </Button>
          </div>
        </Form>
      </FormikProvider>
    </div>
  )
}

