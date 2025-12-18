import { USER_ROLE } from '@/constants/enums'

/**
 * Permission utility functions for role-based access control
 */

export type Permission = 
  | 'create_survey'
  | 'edit_survey'
  | 'delete_survey'
  | 'publish_survey'
  | 'view_responses'
  | 'view_analytics'
  | 'create_workshop'
  | 'edit_workshop'
  | 'delete_workshop'
  | 'view_workshops'
  | 'create_template'
  | 'delete_template'
  | 'respond_to_survey'

/**
 * Permission matrix: Maps roles to their allowed permissions
 */
const PERMISSION_MATRIX: Record<USER_ROLE, Permission[]> = {
  [USER_ROLE.ADMIN]: [
    'create_survey',
    'edit_survey',
    'delete_survey',
    'publish_survey',
    'view_responses',
    'view_analytics',
    'create_workshop',
    'edit_workshop',
    'delete_workshop',
    'view_workshops',
    'create_template',
    'delete_template',
    'respond_to_survey',
  ],
  [USER_ROLE.ORGANIZER]: [
    'create_survey',
    'edit_survey',
    'delete_survey',
    'publish_survey',
    'view_responses',
    'view_analytics',
    'create_workshop',
    'edit_workshop',
    'delete_workshop',
    'view_workshops',
    'create_template',
    'delete_template',
    'respond_to_survey',
  ],
  [USER_ROLE.PARTICIPANT]: [
    'respond_to_survey',
  ],
  [USER_ROLE.VIEWER]: [
    'view_responses',
    'view_analytics',
    'view_workshops',
  ],
}

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role: USER_ROLE | undefined, permission: Permission): boolean => {
  if (!role) return false
  return PERMISSION_MATRIX[role]?.includes(permission) ?? false
}

/**
 * Check if a role has any of the specified permissions
 */
export const hasAnyPermission = (
  role: USER_ROLE | undefined,
  permissions: Permission[]
): boolean => {
  if (!role) return false
  return permissions.some((permission) => hasPermission(role, permission))
}

/**
 * Check if a role has all of the specified permissions
 */
export const hasAllPermissions = (
  role: USER_ROLE | undefined,
  permissions: Permission[]
): boolean => {
  if (!role) return false
  return permissions.every((permission) => hasPermission(role, permission))
}

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (role: USER_ROLE | undefined): Permission[] => {
  if (!role) return []
  return PERMISSION_MATRIX[role] ?? []
}

/**
 * Check if user can create surveys
 */
export const canCreateSurvey = (role: USER_ROLE | undefined): boolean => {
  return hasPermission(role, 'create_survey')
}

/**
 * Check if user can edit surveys
 */
export const canEditSurvey = (role: USER_ROLE | undefined): boolean => {
  return hasPermission(role, 'edit_survey')
}

/**
 * Check if user can delete surveys
 */
export const canDeleteSurvey = (role: USER_ROLE | undefined): boolean => {
  return hasPermission(role, 'delete_survey')
}

/**
 * Check if user can publish surveys
 */
export const canPublishSurvey = (role: USER_ROLE | undefined): boolean => {
  return hasPermission(role, 'publish_survey')
}

/**
 * Check if user can view responses
 */
export const canViewResponses = (role: USER_ROLE | undefined): boolean => {
  return hasPermission(role, 'view_responses')
}

/**
 * Check if user can view analytics
 */
export const canViewAnalytics = (role: USER_ROLE | undefined): boolean => {
  return hasPermission(role, 'view_analytics')
}

/**
 * Check if user can create workshops
 */
export const canCreateWorkshop = (role: USER_ROLE | undefined): boolean => {
  return hasPermission(role, 'create_workshop')
}

/**
 * Check if user can edit workshops
 */
export const canEditWorkshop = (role: USER_ROLE | undefined): boolean => {
  return hasPermission(role, 'edit_workshop')
}

/**
 * Check if user can delete workshops
 */
export const canDeleteWorkshop = (role: USER_ROLE | undefined): boolean => {
  return hasPermission(role, 'delete_workshop')
}

/**
 * Check if user can respond to surveys
 */
export const canRespondToSurvey = (role: USER_ROLE | undefined): boolean => {
  return hasPermission(role, 'respond_to_survey')
}

