import { Effect } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import { UserNotFoundError, InvalidUserTransitionError } from '../errors/entry'
import type { UserId } from '../value-objects/entry'

export const ISuspendUserUsecase = Symbol('ISuspendUserUsecase')

export interface SuspendUserUsecase {
  execute(params: {
    userId: UserId
    reason: string
  }): Effect.Effect<
    void,
    UserNotFoundError | InvalidUserTransitionError | DatabaseFailure
  >
}
