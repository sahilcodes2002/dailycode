export const NAVIGATION = {
  // Public routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  PROBLEM_DETAIL: (id) => `/problems/${id}`,
  DISCOVER: '/discover',
  SUBMIT: '/submit',
  PROFILE: '/profile',
  HISTORY: '/history',
  STARRED: '/starred',
  STATS: '/stats',
};