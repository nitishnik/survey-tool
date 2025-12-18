import { TargetAudience } from '../../survey-management.types'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import HelpIcon from '@/components/common/HelpIcon'

interface TargetAudienceSelectorProps {
  value: TargetAudience
  onChange: (audience: TargetAudience) => void
  errors?: any
  touched?: any
}

const MOCK_TEAMS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Support']
const MOCK_DEPARTMENTS = ['Technology', 'Operations', 'Business Development', 'HR']
const MOCK_ROLES = ['Manager', 'Senior', 'Mid-level', 'Junior', 'Intern']
const MOCK_LOCATIONS = ['New York', 'San Francisco', 'London', 'Remote']

export default function TargetAudienceSelector({
  value,
  onChange,
}: TargetAudienceSelectorProps) {
  const handleToggle = (
    category: keyof TargetAudience,
    item: string,
    currentList: string[] = []
  ) => {
    const newList = currentList.includes(item)
      ? currentList.filter((i) => i !== item)
      : [...currentList, item]
    onChange({ ...value, [category]: newList })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Label className="text-base font-semibold">Target Audience</Label>
        <HelpIcon content="Select the teams, departments, roles, or locations that should receive this survey. You can select multiple groups." />
      </div>
      {/* Teams */}
      <div className="space-y-2">
        <Label>Teams</Label>
        <div className="flex flex-wrap gap-2">
          {MOCK_TEAMS.map((team) => {
            const isSelected = value.teams?.includes(team) || false
            return (
              <button
                key={team}
                type="button"
                onClick={() => handleToggle('teams', team, value.teams)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {team}
              </button>
            )
          })}
        </div>
        {value.teams && value.teams.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {value.teams.map((team) => (
              <span
                key={team}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                {team}
                <button
                  type="button"
                  onClick={() => handleToggle('teams', team, value.teams)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Departments */}
      <div className="space-y-2">
        <Label>Departments</Label>
        <div className="flex flex-wrap gap-2">
          {MOCK_DEPARTMENTS.map((dept) => {
            const isSelected = value.departments?.includes(dept) || false
            return (
              <button
                key={dept}
                type="button"
                onClick={() => handleToggle('departments', dept, value.departments)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept}
              </button>
            )
          })}
        </div>
        {value.departments && value.departments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {value.departments.map((dept) => (
              <span
                key={dept}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                {dept}
                <button
                  type="button"
                  onClick={() => handleToggle('departments', dept, value.departments)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Roles */}
      <div className="space-y-2">
        <Label>Roles</Label>
        <div className="flex flex-wrap gap-2">
          {MOCK_ROLES.map((role) => {
            const isSelected = value.roles?.includes(role) || false
            return (
              <button
                key={role}
                type="button"
                onClick={() => handleToggle('roles', role, value.roles)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {role}
              </button>
            )
          })}
        </div>
        {value.roles && value.roles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {value.roles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                {role}
                <button
                  type="button"
                  onClick={() => handleToggle('roles', role, value.roles)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Locations */}
      <div className="space-y-2">
        <Label>Locations</Label>
        <div className="flex flex-wrap gap-2">
          {MOCK_LOCATIONS.map((location) => {
            const isSelected = value.locations?.includes(location) || false
            return (
              <button
                key={location}
                type="button"
                onClick={() => handleToggle('locations', location, value.locations)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {location}
              </button>
            )
          })}
        </div>
        {value.locations && value.locations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {value.locations.map((location) => (
              <span
                key={location}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                {location}
                <button
                  type="button"
                  onClick={() => handleToggle('locations', location, value.locations)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

