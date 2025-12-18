import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/routes/route'

interface NotFoundPageProps {
  title?: string
  message?: string
  showBackButton?: boolean
}

export default function NotFoundPage({
  title = '404 - Page Not Found',
  message = "The page you're looking for doesn't exist or you don't have permission to access it.",
  showBackButton = true,
}: NotFoundPageProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
          <p className="text-gray-500">{message}</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          {showBackButton && (
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          )}
          <Button onClick={() => navigate(ROUTES.HOME)}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

