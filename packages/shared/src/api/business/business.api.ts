export namespace BusinessApi {
  export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise'
  export type StatusType =
    | 'pending_verification'
    | 'active'
    | 'inactive'
    | 'suspended'

  export namespace Register {
    export interface Request {
      ownerId: string
      name: string
      slug: string
      email: string
      timezone: string
      currency: string
      phone?: string
      plan?: string
    }
    export interface Response {
      id: string
    }
  }

  export namespace GetBusiness {
    export interface Response {
      id: string
      ownerId: string
      name: string
      slug: string
      email: string
      phone: string | null
      timezone: string
      status: StatusType
      plan: PlanType
      currency: string
      logoUrl: string | null
      description: string | null
      website: string | null
      isDeleted: boolean
      createdAt: string
    }
  }

  export namespace UpdateProfile {
    export interface Request {
      actorId: string
      name?: string
      description?: string | null
      website?: string | null
      logoUrl?: string | null
      phone?: string | null
      timezone?: string
      email?: string
      currency?: string
    }
  }

  export namespace UpdateSlug {
    export interface Request {
      slug: string
      actorId: string
    }
  }

  export namespace ChangePlan {
    export interface Request {
      plan: PlanType
      actorId: string
    }
  }

  export namespace Activate {
    export interface Request {
      actorId: string
    }
  }

  export namespace Deactivate {
    export interface Request {
      actorId: string
    }
  }

  export namespace Reactivate {
    export interface Request {
      actorId: string
    }
  }

  export namespace Suspend {
    export interface Request {
      reason: string
      actorId: string
    }
  }

  export namespace Delete {
    export interface Request {
      actorId: string
    }
  }
}
