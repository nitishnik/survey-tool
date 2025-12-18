import { FormikProvider, Form } from 'formik'
import { useAddEditWorkshopHook } from './index.hook'
import { Button } from '@/components/ui/button'
import Breadcrumb, { BreadcrumbItem } from '@/components/common/breadcrumb'
import { ROUTES } from '@/routes/route'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ErrorMessage } from 'formik'
import { Save, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TargetAudienceSelector from '@/features/survey-management/add-edit-survey/components/target-audience-selector'
import SurveySelector from './components/survey-selector'
import AddEditWorkshopSkeleton from './index.skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'

export default function AddEditWorkshop() {
  const navigate = useNavigate()
  const {
    formik,
    isLoading,
    isEditMode,
    handleAddObjective,
    handleRemoveObjective,
    handleUpdateObjective,
    handleToggleSurvey,
  } = useAddEditWorkshopHook()

  const { values, errors, touched, isSubmitting } = formik

  if (isLoading && isEditMode) {
    return <AddEditWorkshopSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbItem onClick={() => navigate(ROUTES.WORKSHOPS.LIST)}>
          Workshops
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          {isEditMode ? 'Edit Workshop' : 'Create Workshop'}
        </BreadcrumbItem>
      </Breadcrumb>

      <h1 className="text-3xl font-bold text-gray-900">
        {isEditMode ? 'Edit Workshop' : 'Create New Workshop'}
      </h1>
      <p className="text-gray-600">
        {isEditMode
          ? 'Modify the details of your workshop.'
          : 'Plan a workshop based on survey insights and feedback.'}
      </p>

      <FormikProvider value={formik}>
        <Form className="space-y-6">
          {/* Workshop Details */}
          <Card>
            <CardHeader>
              <CardTitle>Workshop Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Workshop Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Agile Training Workshop"
                  className={errors.title && touched.title ? 'shadow-md shadow-destructive/50' : ''}
                />
                <ErrorMessage name="title">
                  {(msg) => (
                    <div className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">
                  Topic <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="topic"
                  name="topic"
                  value={values.topic}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Agile Methodology"
                  className={errors.topic && touched.topic ? 'shadow-md shadow-destructive/50' : ''}
                />
                <ErrorMessage name="topic">
                  {(msg) => (
                    <div className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Describe the purpose and goals of this workshop"
                  rows={4}
                  className={errors.description && touched.description ? 'shadow-md shadow-destructive/50' : ''}
                />
                <ErrorMessage name="description">
                  {(msg) => (
                    <div className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </div>
            </CardContent>
          </Card>

          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {values.objectives.map((objective) => (
                  <div key={objective.id} className="flex items-start gap-3 p-4 rounded-lg shadow-sm">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Label className="text-sm font-medium">Priority:</Label>
                        <Select
                          value={objective.priority}
                          onValueChange={(value) =>
                            handleUpdateObjective(objective.id, { priority: value as any })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        value={objective.description}
                        onChange={(e) =>
                          handleUpdateObjective(objective.id, { description: e.target.value })
                        }
                        placeholder="Enter objective description"
                        rows={2}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveObjective(objective.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddObjective}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Objective
                </Button>
              </div>
              {errors.objectives && typeof errors.objectives === 'string' && (
                <div className="text-sm text-destructive mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.objectives}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Linked Surveys */}
          <SurveySelector
            selectedSurveyIds={values.linkedSurveyIds || []}
            onToggle={handleToggleSurvey}
          />

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
            </CardHeader>
            <CardContent>
              <TargetAudienceSelector
                value={values.targetAudience}
                onChange={(audience) => formik.setFieldValue('targetAudience', audience)}
              />
              {errors.targetAudience && touched.targetAudience && (
                <div className="text-sm text-destructive mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Please select at least one target audience group.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule & Logistics */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Logistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">
                    Scheduled Date & Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="scheduledDate"
                    name="scheduledDate"
                    type="datetime-local"
                    value={values.scheduledDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={errors.scheduledDate && touched.scheduledDate ? 'shadow-md shadow-destructive/50' : ''}
                  />
                  <ErrorMessage name="scheduledDate">
                    {(msg) => (
                      <div className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{msg}</span>
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">
                    Duration (minutes) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="15"
                    max="480"
                    value={values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={errors.duration && touched.duration ? 'shadow-md shadow-destructive/50' : ''}
                  />
                  <ErrorMessage name="duration">
                    {(msg) => (
                      <div className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{msg}</span>
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedSize">
                    Expected Size <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="expectedSize"
                    name="expectedSize"
                    type="number"
                    min="1"
                    max="1000"
                    value={values.expectedSize}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={errors.expectedSize && touched.expectedSize ? 'shadow-md shadow-destructive/50' : ''}
                  />
                  <ErrorMessage name="expectedSize">
                    {(msg) => (
                      <div className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{msg}</span>
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input
                    id="location"
                    name="location"
                    value={values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., Conference Room A, Online"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.WORKSHOPS.LIST)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Workshop'}
            </Button>
          </div>
        </Form>
      </FormikProvider>
    </div>
  )
}

