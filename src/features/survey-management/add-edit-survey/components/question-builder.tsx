import { Question } from '../../survey-management.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { GripVertical, Trash2, Plus, X } from 'lucide-react'
import { QUESTION_TYPE } from '@/constants/enums'
import { useState } from 'react'
import HelpIcon from '@/components/common/HelpIcon'

interface QuestionBuilderProps {
  questions: Question[]
  onAdd: () => void
  onRemove: (questionId: string) => void
  onUpdate: (questionId: string, updates: Partial<Question>) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  errors?: any
  touched?: any
}

export default function QuestionBuilder({
  questions,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
  errors,
  touched,
}: QuestionBuilderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newQuestions = [...questions]
    const dragged = newQuestions[draggedIndex]
    newQuestions.splice(draggedIndex, 1)
    newQuestions.splice(index, 0, dragged)

    onReorder(draggedIndex, index)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleAddOption = (questionId: string, currentOptions: string[] = []) => {
    const newOption = ''
    onUpdate(questionId, { options: [...currentOptions, newOption] })
  }

  const handleUpdateOption = (
    questionId: string,
    optionIndex: number,
    value: string,
    currentOptions: string[]
  ) => {
    const updated = [...currentOptions]
    updated[optionIndex] = value
    onUpdate(questionId, { options: updated })
  }

  const handleRemoveOption = (
    questionId: string,
    optionIndex: number,
    currentOptions: string[]
  ) => {
    const updated = currentOptions.filter((_, i) => i !== optionIndex)
    onUpdate(questionId, { options: updated })
  }

  return (
    <div className="space-y-4">
      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No questions yet. Add your first question to get started.</p>
        </div>
      )}

      {questions.map((question, index) => (
        <div
          key={question.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className="rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-move shadow-sm hover:shadow-md"
        >
          <div className="flex items-start gap-3">
            <div className="mt-2 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex-1 space-y-4">
              {/* Question Number and Type */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                <div className="flex items-center gap-2">
                  <Select
                    value={question.type}
                    onValueChange={(value) =>
                      onUpdate(question.id, {
                        type: value as QUESTION_TYPE,
                        options: value === QUESTION_TYPE.MULTIPLE_CHOICE ? ['', ''] : undefined,
                      })
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={QUESTION_TYPE.MULTIPLE_CHOICE}>Multiple Choice</SelectItem>
                      <SelectItem value={QUESTION_TYPE.RATING_SCALE}>Rating Scale</SelectItem>
                      <SelectItem value={QUESTION_TYPE.SHORT_TEXT}>Short Text</SelectItem>
                      <SelectItem value={QUESTION_TYPE.LONG_TEXT}>Long Text</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(question.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <Label>
                  Question Text <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  value={question.text}
                  onChange={(e) => onUpdate(question.id, { text: e.target.value })}
                  placeholder="Enter your question"
                  rows={2}
                />
                {errors?.questions?.[index]?.text && touched?.questions?.[index]?.text && (
                  <div className="text-sm text-destructive">
                    {errors.questions[index].text}
                  </div>
                )}
              </div>

              {/* Multiple Choice Options */}
              {question.type === QUESTION_TYPE.MULTIPLE_CHOICE && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {question.options?.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleUpdateOption(question.id, optIndex, e.target.value, question.options || [])
                        }
                        placeholder={`Option ${optIndex + 1}`}
                        className="flex-1"
                      />
                      {question.options && question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveOption(question.id, optIndex, question.options || [])
                          }
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddOption(question.id, question.options)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Option
                  </Button>
                  {errors?.questions?.[index]?.options && (
                    <div className="text-sm text-destructive">
                      {errors.questions[index].options}
                    </div>
                  )}
                </div>
              )}

              {/* Rating Scale Info */}
              {question.type === QUESTION_TYPE.RATING_SCALE && (
                <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded">
                  Rating scale: 1 (Lowest) to 5 (Highest)
                </div>
              )}

              {/* Required Toggle */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`required-${question.id}`}
                  checked={question.required}
                  onCheckedChange={(checked) => onUpdate(question.id, { required: checked === true })}
                />
                <Label htmlFor={`required-${question.id}`} className="font-normal cursor-pointer">
                  Required question
                </Label>
                <HelpIcon content="Required questions must be answered before the survey can be submitted." />
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Question
      </Button>

      {errors?.questions && typeof errors.questions === 'string' && (
        <div className="text-sm text-destructive">{errors.questions}</div>
      )}
    </div>
  )
}

