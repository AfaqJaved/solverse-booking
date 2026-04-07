export namespace BreakApi {
  export namespace Create {
    export interface Request {
      workingHoursId: string
      label: string
      startTime: string
      endTime: string
      createdBy: string
    }
    export interface Response {
      id: string
      workingHoursId: string
      label: string
      startTime: string
      endTime: string
      isDeleted: boolean
      createdAt: string
    }
  }

  export namespace GetBreak {
    export interface Response {
      id: string
      workingHoursId: string
      label: string
      startTime: string
      endTime: string
      isDeleted: boolean
      createdAt: string
      updatedAt: string
      createdBy: string | null
      updatedBy: string | null
    }
  }

  export namespace GetBreaksByWorkingHours {
    export interface Response {
      breaks: Array<{
        id: string
        workingHoursId: string
        label: string
        startTime: string
        endTime: string
        isDeleted: boolean
        createdAt: string
        updatedAt: string
      }>
    }
  }

  export namespace UpdateTimes {
    export interface Request {
      startTime: string
      endTime: string
      updatedBy: string
    }
  }

  export namespace Delete {
    export interface Request {
      deletedBy: string
    }
  }
}
