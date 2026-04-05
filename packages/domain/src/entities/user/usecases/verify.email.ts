import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  EmailNotVerifiedError,
  InvalidUserTransitionError,
  UserAlreadyActiveError,
  UserNotFoundError,
} from '../errors/entry'

export const IVerifyEmailUsecase = Symbol('IVerifyEmailUsecase')

export interface VerifyEmailUsecase {
  execute(params: {
    userId: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | UserNotFoundError
    | UserAlreadyActiveError
    | EmailNotVerifiedError
    | InvalidUserTransitionError
    | DatabaseFailure
  >
}
