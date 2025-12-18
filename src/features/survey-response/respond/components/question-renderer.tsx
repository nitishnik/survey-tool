import { Question } from '@/features/survey-management/survey-management.types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { QUESTION_TYPE } from '@/constants/enums'

interface QuestionRendererProps {
  question: Question
  value: string | number | string[] | undefined
  onChange: (value: string | number | string[]) => void
  error?: string
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  error,
}: QuestionRendererProps) {
  const renderQuestion = () => {
    switch (question.type) {
      case QUESTION_TYPE.SHORT_TEXT:
        return (
          <Input
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your answer"
            className={error ? 'border-destructive' : ''}
          />
        )

      case QUESTION_TYPE.LONG_TEXT:
        return (
          <Textarea
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your answer"
            rows={4}
            className={error ? 'border-destructive' : ''}
          />
        )

      case QUESTION_TYPE.MULTIPLE_CHOICE:
        return (
          <RadioGroup
            value={Array.isArray(value) ? value[0] : (value as string) || ''}
            onValueChange={(val) => onChange(val as string)}
            className={error ? 'border-destructive' : ''}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className="font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case QUESTION_TYPE.RATING_SCALE:
        return (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">1 (Lowest)</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onChange(rating)}
                  className={`w-10 h-10 rounded-md border-2 transition-colors ${
                    value === rating
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-input hover:bg-accent'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500">5 (Highest)</span>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={question.id} className="block">
        {question.text}
        {question.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderQuestion()}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

