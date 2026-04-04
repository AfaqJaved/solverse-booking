import { Effect } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import { UserNotFoundError, InvalidUserTransitionError } from '../errors/entry'
import type { UserId } from '../value-objects/entry'

export const IDeactivateUserUsecase = Symbol('IDeactivateUserUsecase')

export interface DeactivateUserUsecase {
  execute(params: {
    userId: UserId
  }): Effect.Effect<
    void,
    UserNotFoundError | InvalidUserTransitionError | DatabaseFailure
  >
}
