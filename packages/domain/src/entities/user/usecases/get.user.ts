import { Effect } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import { UserNotFoundError } from '../errors/entry'
import type { UserId, UserRole, UserStatus } from '../value-objects/entry'
import type { Email, Timezone } from '../../common/entry'
import type { FullName, NotificationPreferences } from '../value-objects/entry'

export interface SafeUserData {
  id: UserId
  username: string
  name: FullName
  email: Email
  phone: string | null
  role: UserRole
  status: UserStatus
  timezone: Timezone
  avatarUrl: string | null
  emailVerified: boolean
  notificationPreferences: NotificationPreferences
  lastLoginAt: Date | null
  createdAt: Date
}

export const IGetUserUsecase = Symbol('IGetUserUsecase')

export interface GetUserUsecase {
  execute(params: {
    userId: UserId
  }): Effect.Effect<SafeUserData, UserNotFoundError | DatabaseFailure>
}
