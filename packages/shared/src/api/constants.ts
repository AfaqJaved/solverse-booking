export const APICONSTANTS = {
  BASE_PATHS: {
    USERS: 'users',
    BUSINESSES: 'businesses',
    SERVICES: 'services',
    WORKING_HOURS: 'working-hours',
    BREAKS: 'breaks',
    TIMEOFF: 'timeoff',
    ONBOARDING: 'onboarding',
  },

  // Route paths for controllers (relative to base path)
  ROUTES: {
    AUTH: {
      LOGIN: 'login',
      LOGOUT: 'logout',
      VERIFY_EMAIL: ':userId/verify-email',
      REFRESH_TOKEN: 'refresh-token',
    },

    USERS: {
      REGISTER: 'register',
      GET_BY_ID: ':userId',
      UPDATE_PROFILE: ':userId/profile',
      CHANGE_EMAIL: ':userId/email',
      DEACTIVATE: ':userId',
      REACTIVATE: ':userId/reactivate',
      SUSPEND: ':userId/suspend',
    },

    BUSINESSES: {
      CREATE: '',
      GET_BY_ID: ':businessId',
      GET_BY_OWNER: 'owner/:ownerId',
      UPDATE_PROFILE: ':businessId/profile',
      UPDATE_SLUG: ':businessId/slug',
      CHANGE_PLAN: ':businessId/plan',
      ACTIVATE: ':businessId/activate',
      DEACTIVATE: ':businessId/deactivate',
      REACTIVATE: ':businessId/reactivate',
      SUSPEND: ':businessId/suspend',
      DELETE: ':businessId',
    },

    SERVICES: {
      CREATE: '',
      GET_BY_ID: ':serviceId',
      GET_BY_BUSINESS: 'business/:businessId',
      UPDATE: ':serviceId',
      ACTIVATE: ':serviceId/activate',
      DEACTIVATE: ':serviceId/deactivate',
      DELETE: ':serviceId',
    },

    WORKING_HOURS: {
      CREATE: '',
      GET_BY_ID: ':workingHoursId',
      GET_BY_BUSINESS: 'business/:businessId',
      UPDATE: ':workingHoursId',
      DELETE: ':workingHoursId',
    },

    BREAKS: {
      CREATE: '',
      GET_BY_ID: ':breakId',
      GET_BY_WORKING_HOURS: '',
      UPDATE_TIMES: ':breakId/times',
      DELETE: ':breakId',
    },

    TIMEOFF: {
      CREATE: '',
      GET_ALL: '',
      GET_BY_ID: ':timeoffId',
      UPDATE: ':timeoffId',
      DELETE: ':timeoffId',
      CANCEL: ':timeoffId/cancel',
    },

    ONBOARDING: {
      REGISTER: 'register',
    },
  },

  // Full URLs for clients
  AUTH: {
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    VERIFY_EMAIL: (userId: string) => `/users/${userId}/verify-email`,
    REFRESH_TOKEN: '/users/refresh-token',
  },

  USERS: {
    REGISTER: '/users/register',
    GET_BY_ID: (userId: string) => `/users/${userId}`,
    UPDATE_PROFILE: (userId: string) => `/users/${userId}/profile`,
    CHANGE_EMAIL: (userId: string) => `/users/${userId}/email`,
    DEACTIVATE: (userId: string) => `/users/${userId}`,
    REACTIVATE: (userId: string) => `/users/${userId}/reactivate`,
    SUSPEND: (userId: string) => `/users/${userId}/suspend`,
  },

  BUSINESSES: {
    CREATE: '/businesses',
    GET_BY_ID: (businessId: string) => `/businesses/${businessId}`,
    GET_BY_OWNER: (ownerId: string) => `/businesses/owner/${ownerId}`,
    UPDATE_PROFILE: (businessId: string) => `/businesses/${businessId}/profile`,
    UPDATE_SLUG: (businessId: string) => `/businesses/${businessId}/slug`,
    CHANGE_PLAN: (businessId: string) => `/businesses/${businessId}/plan`,
    ACTIVATE: (businessId: string) => `/businesses/${businessId}/activate`,
    DEACTIVATE: (businessId: string) => `/businesses/${businessId}/deactivate`,
    REACTIVATE: (businessId: string) => `/businesses/${businessId}/reactivate`,
    SUSPEND: (businessId: string) => `/businesses/${businessId}/suspend`,
    DELETE: (businessId: string) => `/businesses/${businessId}`,
  },

  SERVICES: {
    CREATE: '/services',
    GET_BY_ID: (serviceId: string) => `/services/${serviceId}`,
    GET_BY_BUSINESS: (businessId: string) => `/services/business/${businessId}`,
    UPDATE: (serviceId: string) => `/services/${serviceId}`,
    ACTIVATE: (serviceId: string) => `/services/${serviceId}/activate`,
    DEACTIVATE: (serviceId: string) => `/services/${serviceId}/deactivate`,
    DELETE: (serviceId: string) => `/services/${serviceId}`,
  },

  WORKING_HOURS: {
    CREATE: '/working-hours',
    GET_BY_ID: (workingHoursId: string) => `/working-hours/${workingHoursId}`,
    GET_BY_BUSINESS: (businessId: string) =>
      `/working-hours/business/${businessId}`,
    UPDATE: (workingHoursId: string) => `/working-hours/${workingHoursId}`,
    DELETE: (workingHoursId: string) => `/working-hours/${workingHoursId}`,
  },

  BREAKS: {
    CREATE: '/breaks',
    GET_BY_ID: (breakId: string) => `/breaks/${breakId}`,
    GET_BY_WORKING_HOURS: '/breaks',
    UPDATE_TIMES: (breakId: string) => `/breaks/${breakId}/times`,
    DELETE: (breakId: string) => `/breaks/${breakId}`,
  },

  TIMEOFF: {
    CREATE: (businessId: string) => `/businesses/${businessId}/timeoff`,
    GET_ALL: (businessId: string) => `/businesses/${businessId}/timeoff`,
    GET_BY_ID: (businessId: string, timeoffId: string) =>
      `/businesses/${businessId}/timeoff/${timeoffId}`,
    UPDATE: (businessId: string, timeoffId: string) =>
      `/businesses/${businessId}/timeoff/${timeoffId}`,
    DELETE: (businessId: string, timeoffId: string) =>
      `/businesses/${businessId}/timeoff/${timeoffId}`,
    CANCEL: (businessId: string, timeoffId: string) =>
      `/businesses/${businessId}/timeoff/${timeoffId}/cancel`,
  },
  ONBOARDING: {
    REGISTER: '/onboarding/register',
  },
}
