export namespace ServiceApi {
  export type StatusType = 'active' | 'inactive'

  export namespace Create {
    export interface Request {
      businessId: string
      name: string
      duration: number
      price: number
      createdBy: string
      description?: string | null
      bufferTime?: number
      color?: string | null
      maxBookingsPerSlot?: number
      status?: StatusType
    }
    export interface Response {
      id: string
      businessId: string
      name: string
      description: string | null
      duration: number
      bufferTime: number
      price: number
      status: StatusType
      color: string | null
      maxBookingsPerSlot: number
      isDeleted: boolean
      createdAt: string
    }
  }

  export namespace GetService {
    export interface Response {
      id: string
      businessId: string
      name: string
      description: string | null
      duration: number
      bufferTime: number
      price: number
      status: StatusType
      color: string | null
      maxBookingsPerSlot: number
      isDeleted: boolean
      createdAt: string
      updatedAt: string
      createdBy: string | null
      updatedBy: string | null
    }
  }

  export namespace GetServicesByBusiness {
    export interface Response {
      services: Array<{
        id: string
        businessId: string
        name: string
        description: string | null
        duration: number
        bufferTime: number
        price: number
        status: StatusType
        color: string | null
        maxBookingsPerSlot: number
        isDeleted: boolean
        createdAt: string
        updatedAt: string
      }>
    }
  }

  export namespace Update {
    export interface Request {
      updatedBy: string
      name?: string
      description?: string | null
      duration?: number
      bufferTime?: number
      price?: number
      color?: string | null
      maxBookingsPerSlot?: number
    }
  }

  export namespace Activate {
    export interface Request {
      updatedBy: string
    }
  }

  export namespace Deactivate {
    export interface Request {
      updatedBy: string
    }
  }

  export namespace Delete {
    export interface Request {
      deletedBy: string
    }
  }
}