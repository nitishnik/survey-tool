export const MESSAGES = {
  SUCCESS: {
    CREATED: 'Item created successfully.',
    UPDATED: 'Item updated successfully.',
    DELETED: 'Item deleted successfully.',
    PUBLISHED: 'Survey published successfully.',
    SUBMITTED: 'Response submitted successfully.',
  },
  ERROR: {
    FETCH_ERROR: 'Failed to fetch data',
    CREATE_ERROR: 'Failed to create item',
    UPDATE_ERROR: 'Failed to update item',
    DELETE_ERROR: 'Failed to delete item',
    GENERIC: 'An unexpected error occurred.',
  },
} as const;

