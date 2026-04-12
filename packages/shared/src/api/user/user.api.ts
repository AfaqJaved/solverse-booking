export namespace UserApi {
  export namespace Login {
    export interface Request {
      userNameOrEmail: string
      password: string
    }
    export interface Response {
      accessToken: string
      refreshToken: string
    }
  }

  export namespace Register {
    export interface FullName {
      firstName: string
      lastName: string
    }
    export interface Request {
      username: string
      password: string
      name: FullName
      email: string
      role: 'superAdmin' | 'businessOwner' | 'locationOwner'
      timezone: string
      phone?: string
    }
    export interface Response {
      id: string
    }
  }

  export namespace VerifyEmail {
    export interface Response {
      data: null
    }
  }

  export namespace GetUser {
    export interface NotificationPreferences {
      email: boolean
      sms: boolean
      push: boolean
    }
    export interface Response {
      id: string
      username: string
      name: { firstName: string; lastName: string }
      email: string
      phone: string | null
      role: 'superAdmin' | 'businessOwner' | 'locationOwner'
      status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
      timezone: string
      avatarUrl: string | null
      emailVerified: boolean
      notificationPreferences: NotificationPreferences
      lastLoginAt: string | null
      createdAt: string
    }
  }

  export namespace UpdateProfile {
    export interface NotificationPreferences {
      email?: boolean
      sms?: boolean
      push?: boolean
    }
    export interface Request {
      timezone?: string
      phone?: string | null
      notificationPreferences?: NotificationPreferences
    }
  }

  export namespace ChangeEmail {
    export interface Request {
      newEmail: string
    }
  }

  export namespace SuspendUser {
    export interface Request {
      reason: string
    }
  }

  export namespace RefreshToken {
    export interface Request {
      refreshToken: string
    }
    export interface Response {
      accessToken: string
    }
  }
}
