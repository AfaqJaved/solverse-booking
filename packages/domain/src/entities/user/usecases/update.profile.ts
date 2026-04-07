import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { UserNotFoundError } from '../errors/entry'

export const IUpdateProfileUsecase = Symbol('IUpdateProfileUsecase')

export interface UpdateProfileUsecase {
  execute(params: {
    userId: string
    timezone?: string
    phone?: string | null
    notificationPreferences?: {
      email?: boolean
      sms?: boolean
      push?: boolean
    }
  }): Effect.Effect<
    void,
    InvalidInputError | UserNotFoundError | DatabaseFailure
  >
}
