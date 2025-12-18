import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, FileStack } from 'lucide-react'
import { ROUTES } from '@/routes/route'
import { useAuthState } from '@/hooks/useAuthState'
import { USER_ROLE } from '@/constants/enums'

const navigation = [
  { name: 'Dashboard', href: ROUTES.HOME, icon: LayoutDashboard },
  { name: 'Surveys', href: ROUTES.SURVEYS.LIST, icon: FileText },
  { name: 'Templates', href: ROUTES.SURVEYS.TEMPLATES, icon: FileStack },
  { name: 'Workshops', href: ROUTES.WORKSHOPS.LIST, icon: Users },
]

export default function Sidebar() {
  const location = useLocation()
  const { userRole } = useAuthState()

  // Filter navigation based on role
  const filteredNavigation = navigation.filter((item) => {
    if (item.href === ROUTES.WORKSHOPS.LIST || item.href === ROUTES.SURVEYS.TEMPLATES) {
      return userRole === USER_ROLE.ADMIN || userRole === USER_ROLE.ORGANIZER
    }
    return true
  })

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 bg-gradient-to-r from-primary/5 to-transparent">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Survey Tool
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Planning & Analytics</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : ''}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

