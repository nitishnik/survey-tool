import { BrowserRouter } from 'react-router-dom'
import { RouteManager } from './routes'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { TooltipProvider } from '@/components/ui/tooltip'

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <BrowserRouter>
          <RouteManager />
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  )
}

export default App

