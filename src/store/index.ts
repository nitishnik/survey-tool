import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice'
import surveyReducer from '../features/survey-management/survey-management.slice'
import templateReducer from '../features/survey-templates/survey-templates.slice'
import responseReducer from '../features/survey-response/survey-response.slice'
import resultsReducer from '../features/survey-results/survey-results.slice'
import workshopReducer from '../features/workshop-planning/workshop-planning.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    survey: surveyReducer,
    templates: templateReducer,
    response: responseReducer,
    results: resultsReducer,
    workshop: workshopReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooks
export { useAppDispatch, useAppSelector } from './hooks'

