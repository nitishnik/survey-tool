import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { getStorageItem, setStorageItem } from '@/utils/storageUtil'

const ONBOARDING_STORAGE_KEY = 'survey_tool_onboarding_completed'

interface OnboardingStep {
  title: string
  content: string
  image?: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Survey & Workshop Planning Tool',
    content: 'Create surveys, collect responses, analyze results, and plan workshops based on insights. Let\'s get you started!',
  },
  {
    title: 'Create Your First Survey',
    content: 'Go to Surveys → Create Survey. Add questions, set target audience, and schedule your survey. You can save surveys as templates for reuse.',
  },
  {
    title: 'Share and Collect Responses',
    content: 'Once published, share your survey link with participants. Track responses in real-time and see participation rates.',
  },
  {
    title: 'Analyze Results',
    content: 'View detailed analytics, charts, and insights from your survey responses. Export data for further analysis.',
  },
  {
    title: 'Plan Workshops',
    content: 'Use survey insights to create targeted workshops. Link surveys to workshops to track which insights informed your planning.',
  },
]

interface OnboardingProps {
  onComplete?: () => void
  skipable?: boolean
}

export default function Onboarding({ onComplete, skipable = true }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasCompleted = getStorageItem<boolean>(ONBOARDING_STORAGE_KEY)
    if (!hasCompleted) {
      setIsVisible(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    setStorageItem(ONBOARDING_STORAGE_KEY, true)
    setIsVisible(false)
    onComplete?.()
  }

  if (!isVisible) return null

  const step = onboardingSteps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === onboardingSteps.length - 1

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full relative">
        {skipable && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{step.title}</CardTitle>
            <div className="text-sm text-gray-500">
              {currentStep + 1} of {onboardingSteps.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 text-lg leading-relaxed">{step.content}</p>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {skipable && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
              )}
              <Button onClick={handleNext} className="flex items-center gap-2">
                {isLastStep ? 'Get Started' : 'Next'}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

