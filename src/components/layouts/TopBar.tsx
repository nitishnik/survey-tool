import { useAuthState } from '@/hooks/useAuthState'
import { useAuth } from '@/hooks/useAuth'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TopBar() {
  const { user, userRole } = useAuthState()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Survey + Workshop Planning Tool
        </h2>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

