export namespace TimeOffApi {
  export namespace CreateTimeOff {
    export interface Request {
      label: string
      allDay: boolean
      cadence: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
      startDate: string
      endDate: string
      startTime?: string | null
      endTime?: string | null
    }

    export interface Response {
      id: string
    }
  }

  export namespace GetTimeOffs {
    export interface QueryParams {
      startDate?: string
      endDate?: string
      status?: 'active' | 'cancelled'
    }

    export interface TimeOff {
      id: string
      businessId: string
      label: string
      allDay: boolean
      cadence: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
      status: 'active' | 'cancelled'
      startDate: string
      endDate: string
      startTime: string | null
      endTime: string | null
      createdAt: string
      createdBy: string | null
      updatedAt: string
      updatedBy: string | null
    }

    export type Response = TimeOff[]
  }

  export namespace GetTimeOff {
    export interface Response {
      id: string
      businessId: string
      label: string
      allDay: boolean
      cadence: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
      status: 'active' | 'cancelled'
      startDate: string
      endDate: string
      startTime: string | null
      endTime: string | null
      createdAt: string
      createdBy: string | null
      updatedAt: string
      updatedBy: string | null
    }
  }

  export namespace UpdateTimeOff {
    export interface Request {
      label?: string
      startDate?: string
      endDate?: string
      startTime?: string | null
      endTime?: string | null
    }
  }

  export namespace DeleteTimeOff {
    export interface Response {
      data: null
    }
  }

  export namespace CancelTimeOff {
    export interface Response {
      data: null
    }
  }
}
