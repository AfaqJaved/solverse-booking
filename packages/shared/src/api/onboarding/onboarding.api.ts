export namespace OnboardingApi {
  export namespace Register {
    export interface DaySchedule {
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
      isOpen: boolean
      openTime?: string | null
      closeTime?: string | null
    }

    export interface BreakInput {
      id: string
      day: DaySchedule['day']
      startTime: string
      endTime: string
      label: string
    }

    export interface TimeOffInput {
      label: string
      allDay: boolean
      cadence: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
      startDate: string
      endDate: string
      startTime?: string | null
      endTime?: string | null
    }

    export interface ServiceInput {
      id: string
      name: string
      duration: number
      price: number
      description?: string | null
    }

    export interface Request {
      owner: {
        firstName: string
        lastName: string
        username: string
        email: string
        phone?: string
        password: string
        timezone: string
      }
      business: {
        name: string
        slug: string
        description?: string | null
        timezone: string
        phone?: string
        email: string
        currency: string
      }
      workingHours: DaySchedule[]
      breaks?: BreakInput[]
      timeOffs?: TimeOffInput[]
      services?: ServiceInput[]
    }

    export interface Response {
      userId: string
      businessId: string
    }
  }
}
