import { useAuthState } from '@/hooks/useAuthState'

export default function TopBar() {
  const { user, userRole } = useAuthState()

  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Survey + Workshop Planning Tool
        </h2>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

