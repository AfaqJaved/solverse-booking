// Export base client and utilities
export * from './client/axios.client'
export * from './client/config'
export * from './client/errors'

// Export authentication
export * from './auth/auth.client'
export * from './auth/token.manager'

// Export entity API clients
export * from './users/user.client'
export * from './businesses/business.client'
export * from './services/service.client'
export * from './working-hours/working.hours.client'
export * from './breaks/break.client'
export * from './timeoff/timeoff.client'

// Re-export shared types for convenience
export type { 
  UserApi, 
  BusinessApi, 
  ServiceApi, 
  WorkingHoursApi, 
  BreakApi, 
  TimeOffApi 
} from '@solverse/shared'