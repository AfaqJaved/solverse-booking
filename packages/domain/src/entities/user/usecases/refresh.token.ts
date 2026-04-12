import { Effect } from 'effect'
import { UserNotFoundError, UserSuspendedError, UserInactiveError } from '../entry'
import { UserInvalidTokenError } from '../errors/user.invalid.token'
import { DatabaseFailure } from '../../../errors/entry'

export const IRefreshTokenUsecase = Symbol('IRefreshTokenUsecase')

export interface RefreshTokenUsecase {
  execute({ refreshToken }: { refreshToken: string }): Effect.Effect<
    { accessToken: string },
    | UserNotFoundError
    | UserSuspendedError
    | UserInactiveError
    | UserInvalidTokenError
    | DatabaseFailure
  >
}
