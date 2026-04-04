import { Effect } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import { UserNotFoundError } from '../errors/entry'
import type { UserId, NotificationPreferences } from '../value-objects/entry'
import type { PhoneNumber, Timezone } from '../../common/entry'

export const IUpdateProfileUsecase = Symbol('IUpdateProfileUsecase')

export interface UpdateProfileUsecase {
  execute(params: {
    userId: UserId
    timezone?: Timezone
    phone?: PhoneNumber | null
    notificationPreferences?: Partial<NotificationPreferences>
  }): Effect.Effect<void, UserNotFoundError | DatabaseFailure>
}
