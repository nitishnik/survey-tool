import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchTemplates, selectTemplates } from '../survey-templates.slice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, FileText, Trash2, Users } from 'lucide-react'
import { ROUTES } from '@/routes/route'
import { TEMPLATE_CATEGORY } from '@/constants/enums'
import { useTemplateListHook } from './index.hook'

const CATEGORY_LABELS: Record<TEMPLATE_CATEGORY, string> = {
  [TEMPLATE_CATEGORY.TRAINING_FEEDBACK]: 'Training Feedback',
  [TEMPLATE_CATEGORY.SKILL_ASSESSMENT]: 'Skill Assessment',
  [TEMPLATE_CATEGORY.PROCESS_MATURITY]: 'Process Maturity',
  [TEMPLATE_CATEGORY.WORKSHOP_READINESS]: 'Workshop Readiness',
}

export default function TemplateList() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const templates = useAppSelector(selectTemplates)
  const isLoading = useAppSelector((state) => state.templates.isLoading)
  const { searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, filteredTemplates, handleDelete, handleUseTemplate } = useTemplateListHook()

  useEffect(() => {
    dispatch(fetchTemplates())
  }, [dispatch])

  if (isLoading && templates.length === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Survey Templates
          </h1>
          <p className="text-gray-600 mt-1">Use pre-built templates to quickly create surveys</p>
        </div>
        <Button
          onClick={() => navigate(ROUTES.SURVEYS.CREATE)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Custom Survey
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as TEMPLATE_CATEGORY | 'all')}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Template List */}
      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter !== 'all'
                ? 'No templates match your search'
                : 'No templates available'}
            </p>
            {!searchTerm && categoryFilter === 'all' && (
              <Button onClick={() => navigate(ROUTES.SURVEYS.CREATE)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Template
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {CATEGORY_LABELS[template.category]}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{template.questions.length} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Used {template.usageCount} times</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleUseTemplate(template.id)}
                  className="w-full"
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

