import { Effect } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import { UserNotFoundError, EmailAlreadyTakenError } from '../errors/entry'
import type { UserId } from '../value-objects/entry'
import type { Email } from '../../common/entry'

export const IChangeEmailUsecase = Symbol('IChangeEmailUsecase')

export interface ChangeEmailUsecase {
  execute(params: {
    userId: UserId
    newEmail: Email
  }): Effect.Effect<
    void,
    UserNotFoundError | EmailAlreadyTakenError | DatabaseFailure
  >
}
