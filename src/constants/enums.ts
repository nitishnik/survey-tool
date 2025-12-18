export enum USER_ROLE {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  PARTICIPANT = 'participant',
  VIEWER = 'viewer',
}

export enum SURVEY_STATUS {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

export enum QUESTION_TYPE {
  MULTIPLE_CHOICE = 'multiple_choice',
  RATING_SCALE = 'rating_scale',
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
}

export enum WORKSHOP_STATUS {
  DRAFT = 'draft',
  PLANNED = 'planned',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TEMPLATE_CATEGORY {
  TRAINING_FEEDBACK = 'training_feedback',
  SKILL_ASSESSMENT = 'skill_assessment',
  PROCESS_MATURITY = 'process_maturity',
  WORKSHOP_READINESS = 'workshop_readiness',
}

