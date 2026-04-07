import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { UserNotFoundError } from '../errors/entry'
import { User } from '../user.aggergate'

export const IGetUserUsecase = Symbol('IGetUserUsecase')

export interface GetUserUsecase {
  execute(params: {
    userId: string
  }): Effect.Effect<
    User,
    InvalidInputError | UserNotFoundError | DatabaseFailure
  >
}
