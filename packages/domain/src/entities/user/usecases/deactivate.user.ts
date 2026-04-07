import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { InvalidUserTransitionError, UserNotFoundError } from '../errors/entry'

export const IDeactivateUserUsecase = Symbol('IDeactivateUserUsecase')

export interface DeactivateUserUsecase {
  execute(params: {
    userId: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | UserNotFoundError
    | InvalidUserTransitionError
    | DatabaseFailure
  >
}
