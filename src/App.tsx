import { BrowserRouter } from 'react-router-dom'
import { RouteManager } from './routes'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { TooltipProvider } from '@/components/ui/tooltip'

// Get base path from environment or use default
const basename = (import.meta as any).env?.BASE_URL || '/survey-tool/'

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <BrowserRouter basename={basename}>
          <RouteManager />
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  )
}

export default App

