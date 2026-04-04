import { Effect } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import {
  UserNotFoundError,
  EmailNotVerifiedError,
  InvalidUserTransitionError,
  UserAlreadyActiveError,
} from '../errors/entry'
import type { UserId } from '../value-objects/entry'

export const IVerifyEmailUsecase = Symbol('IVerifyEmailUsecase')

export interface VerifyEmailUsecase {
  execute(params: {
    userId: UserId
  }): Effect.Effect<
    void,
    | UserNotFoundError
    | UserAlreadyActiveError
    | EmailNotVerifiedError
    | InvalidUserTransitionError
    | DatabaseFailure
  >
}
