import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { deleteTemplate, incrementTemplateUsage, selectTemplates } from '../survey-templates.slice'
import { createSurvey } from '@/features/survey-management/survey-management.slice'
import { toast } from 'sonner'
import { getErrorMessage } from '@/utils/errorUtil'
import { MESSAGES } from '@/constants/messages'
import { TEMPLATE_CATEGORY } from '@/constants/enums'
import { ROUTES } from '@/routes/route'

export const useTemplateListHook = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<TEMPLATE_CATEGORY | 'all'>('all')
  const templates = useAppSelector(selectTemplates)

  const filteredTemplates = useMemo(() => {
    let filtered = templates

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((t) => t.category === categoryFilter)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(term) ||
          template.description.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [templates, searchTerm, categoryFilter])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return
    }

    try {
      await dispatch(deleteTemplate(id)).unwrap()
      toast.success(MESSAGES.SUCCESS.DELETED)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete template'))
    }
  }

  const handleUseTemplate = async (templateId: string) => {
    try {
      const template = templates.find((t) => t.id === templateId)
      if (!template) {
        toast.error('Template not found')
        return
      }

      // Increment usage count
      await dispatch(incrementTemplateUsage(templateId))

      // Create survey from template
      const surveyData = {
        title: `${template.name} Survey`,
        purpose: template.description,
        targetAudience: template.targetAudience,
        openDate: new Date().toISOString().slice(0, 16),
        closeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        questions: template.questions.map((q, index) => ({
          ...q,
          id: `question_${Date.now()}_${index}`,
          order: index,
        })),
      }

      const result = await dispatch(createSurvey(surveyData))
      if (createSurvey.fulfilled.match(result)) {
        toast.success('Survey created from template')
        navigate(ROUTES.SURVEYS.EDIT.replace(':id', result.payload.id))
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create survey from template'))
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    filteredTemplates,
    handleDelete,
    handleUseTemplate,
  }
}

