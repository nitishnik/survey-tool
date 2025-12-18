export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
  },
  SURVEYS: {
    BASE: '/surveys',
    LIST: '/surveys',
    CREATE: '/surveys/create',
    EDIT: '/surveys/edit/:id',
    DETAILS: '/surveys/:id',
    RESPONSE: '/surveys/:id/respond',
    RESULTS: '/surveys/:id/results',
    TRACKING: '/surveys/:id/tracking',
    TEMPLATES: '/surveys/templates',
  },
  WORKSHOPS: {
    BASE: '/workshops',
    LIST: '/workshops',
    CREATE: '/workshops/create',
    EDIT: '/workshops/edit/:id',
    DETAILS: '/workshops/:id',
    MAPPING: '/workshops/mapping',
  },
} as const;

export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.HOME]: 'Dashboard',
  [ROUTES.AUTH.LOGIN]: 'Login',
  [ROUTES.SURVEYS.LIST]: 'Surveys',
  [ROUTES.SURVEYS.CREATE]: 'Create Survey',
  [ROUTES.SURVEYS.TEMPLATES]: 'Survey Templates',
  [ROUTES.WORKSHOPS.LIST]: 'Workshops',
  [ROUTES.WORKSHOPS.CREATE]: 'Create Workshop',
};

