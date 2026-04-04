import { Effect } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import {
  UserNotFoundError,
  UserSuspendedError,
  InvalidUserTransitionError,
} from '../errors/entry'
import type { UserId } from '../value-objects/entry'

export const IReactivateUserUsecase = Symbol('IReactivateUserUsecase')

export interface ReactivateUserUsecase {
  execute(params: {
    userId: UserId
  }): Effect.Effect<
    void,
    | UserNotFoundError
    | UserSuspendedError
    | InvalidUserTransitionError
    | DatabaseFailure
  >
}
