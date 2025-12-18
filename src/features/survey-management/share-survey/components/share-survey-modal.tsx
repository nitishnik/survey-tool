import { useState } from 'react'
import { Survey } from '../../../survey-management/survey-management.types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Check, Mail, Link as LinkIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ShareSurveyModalProps {
  survey: Survey
  trigger?: React.ReactNode
}

export default function ShareSurveyModal({ survey, trigger }: ShareSurveyModalProps) {
  const [copied, setCopied] = useState(false)
  const [emailList, setEmailList] = useState('')

  const surveyLink = `${window.location.origin}/surveys/${survey.id}/respond`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyLink)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleCopyEmails = () => {
    const emails = emailList.split(',').map((e) => e.trim()).filter(Boolean)
    if (emails.length === 0) {
      toast.error('Please enter at least one email address')
      return
    }
    // In a real app, this would send emails via backend
    toast.success(`Would send survey to ${emails.length} email(s)`)
    setEmailList('')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <LinkIcon className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Survey</DialogTitle>
          <DialogDescription>
            Share this survey with your team members. They can access it via the link below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Survey Link */}
          <div className="space-y-2">
            <Label>Survey Link</Label>
            <div className="flex items-center gap-2">
              <Input value={surveyLink} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Email Invitations */}
          <div className="space-y-2">
            <Label>Send via Email (comma-separated)</Label>
            <div className="flex items-center gap-2">
              <Input
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
                className="flex-1"
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleCopyEmails}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Note: Email sending requires backend integration
            </p>
          </div>

          {/* Survey Info */}
          <div className="pt-4">
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Survey:</span> {survey.title}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className="capitalize">{survey.status}</span>
              </p>
              <p>
                <span className="font-medium">Questions:</span> {survey.questions.length}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

