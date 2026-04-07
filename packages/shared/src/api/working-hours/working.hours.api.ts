export namespace WorkingHoursApi {
  export type DayOfWeekType =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'

  export namespace Create {
    export interface Request {
      businessId: string
      dayOfWeek: DayOfWeekType
      isOpen: boolean
      openTime?: string | null
      closeTime?: string | null
      createdBy: string
    }
    export interface Response {
      id: string
      businessId: string
      dayOfWeek: DayOfWeekType
      isOpen: boolean
      openTime: string | null
      closeTime: string | null
      createdAt: string
    }
  }

  export namespace GetWorkingHours {
    export interface Response {
      id: string
      businessId: string
      dayOfWeek: DayOfWeekType
      isOpen: boolean
      openTime: string | null
      closeTime: string | null
      isDeleted: boolean
      createdAt: string
      updatedAt: string
      createdBy: string | null
      updatedBy: string | null
    }
  }

  export namespace ListWorkingHoursByBusiness {
    export interface Response {
      workingHours: Array<{
        id: string
        businessId: string
        dayOfWeek: DayOfWeekType
        isOpen: boolean
        openTime: string | null
        closeTime: string | null
        isDeleted: boolean
        createdAt: string
        updatedAt: string
      }>
    }
  }

  export namespace Update {
    export interface Request {
      updatedBy: string
      isOpen?: boolean
      openTime?: string | null
      closeTime?: string | null
    }
  }

  export namespace Delete {
    export interface Request {
      deletedBy: string
    }
  }
}
