import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  InvalidUserTransitionError,
  UserNotFoundError,
  UserSuspendedError,
} from '../errors/entry'

export const IReactivateUserUsecase = Symbol('IReactivateUserUsecase')

export interface ReactivateUserUsecase {
  execute(params: {
    userId: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | UserNotFoundError
    | UserSuspendedError
    | InvalidUserTransitionError
    | DatabaseFailure
  >
}
