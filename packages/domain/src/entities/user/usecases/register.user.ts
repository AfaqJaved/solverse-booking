import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { EmailAlreadyTakenError } from '../errors/entry'
import { UserRoleType } from 'entry'

export const IRegisterUserUsecase = Symbol('IRegisterUserUsecase')

export interface RegisterUserUsecase {
  execute(params: {
    username: string
    password: string
    name: { firstName: string; lastName: string }
    email: string
    role: UserRoleType
    timezone: string
    phone?: string
  }): Effect.Effect<
    { id: string },
    InvalidInputError | EmailAlreadyTakenError | DatabaseFailure
  >
}
