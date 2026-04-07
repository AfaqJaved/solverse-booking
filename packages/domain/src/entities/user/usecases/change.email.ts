import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { EmailAlreadyTakenError, UserNotFoundError } from '../errors/entry'

export const IChangeEmailUsecase = Symbol('IChangeEmailUsecase')

export interface ChangeEmailUsecase {
  execute(params: {
    userId: string
    newEmail: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | UserNotFoundError
    | EmailAlreadyTakenError
    | DatabaseFailure
  >
}
