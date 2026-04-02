import { Effect } from 'effect'
import { UserNotFoundError, UserSuspendedError, UserInactiveError } from 'entry'
import { UserInvalidCredentialsError } from '../errors/user.invalid.credintionals'

export const ILoginUserUsecase = Symbol('ILoginUserUsecase')

export interface LoginUserUsecase {
  execute({
    userNameOrEmail,
    password,
  }: {
    userNameOrEmail: string
    password: string
  }): Effect.Effect<
    { token: string },
    | UserNotFoundError
    | UserSuspendedError
    | UserInactiveError
    | UserInvalidCredentialsError
  >
}
