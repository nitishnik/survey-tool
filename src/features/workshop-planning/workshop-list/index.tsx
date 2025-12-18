import { useWorkshopListHook } from './index.hook'
import WorkshopCard from './components/workshop-card'
import WorkshopListSkeleton from './index.skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/route'
import { useAppSelector } from '@/store'
import { useAuthState } from '@/hooks/useAuthState'
import { canCreateWorkshop } from '@/utils/permissionsUtil'

export default function WorkshopList() {
  const navigate = useNavigate()
  const { userRole } = useAuthState()
  const { searchTerm, setSearchTerm, filteredWorkshops, handleDelete, handleSchedule, handleComplete } =
    useWorkshopListHook()
  const isLoading = useAppSelector((state) => state.workshop.isLoading)

  const handleEdit = (workshopId: string) => {
    navigate(ROUTES.WORKSHOPS.EDIT.replace(':id', workshopId))
  }

  if (isLoading) {
    return <WorkshopListSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Workshops</h1>
        {canCreateWorkshop(userRole) && (
          <Button onClick={() => navigate(ROUTES.WORKSHOPS.CREATE)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Workshop
          </Button>
        )}
      </div>
      <p className="text-gray-600">
        Plan and manage workshops based on survey insights and feedback.
      </p>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search workshops by title, topic, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Workshop List */}
      {filteredWorkshops.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            {searchTerm
              ? 'No workshops found matching your search.'
              : 'No workshops yet. Start by creating a new workshop!'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              onEdit={() => handleEdit(workshop.id)}
              onDelete={() => handleDelete(workshop.id)}
              onSchedule={() => handleSchedule(workshop.id)}
              onComplete={() => handleComplete(workshop.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

