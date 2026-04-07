import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { InvalidUserTransitionError, UserNotFoundError } from '../errors/entry'

export const ISuspendUserUsecase = Symbol('ISuspendUserUsecase')

export interface SuspendUserUsecase {
  execute(params: {
    userId: string
    reason: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | UserNotFoundError
    | InvalidUserTransitionError
    | DatabaseFailure
  >
}
