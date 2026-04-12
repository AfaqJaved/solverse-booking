import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  RefreshTokenUsecase,
  User,
  UserInactiveError,
  UserInvalidTokenError,
  UserNotFoundError,
  UserSuspendedError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { JwtUtils } from '../../../lib/jwt/entry'
import { LoginJwtPayload } from '../../../lib/jwt/payload/login.jwt.payload'
import { UserId } from '@solverse/domain'

@Injectable()
export class RefreshTokenUsecaseImpl implements RefreshTokenUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({ refreshToken }: { refreshToken: string }): Effect.Effect<
    { accessToken: string },
    | UserNotFoundError
    | UserSuspendedError
    | UserInactiveError
    | UserInvalidTokenError
    | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const payload = yield* JwtUtils.verifyToken<LoginJwtPayload>(
        refreshToken,
        { issuer: 'solverse', secretEnvKey: 'JWT_REFRESH_SECRET' },
      ).pipe(
        Effect.mapError(
          () =>
            new UserInvalidTokenError({
              message: 'Invalid or expired refresh token',
              cause: 'Invalid or expired refresh token',
            }),
        ),
      )

      const maybeUser = yield* this.repositoryFactory.userRepository.findById(
        payload.userId as UserId,
      )

      if (Option.isNone(maybeUser)) {
        return yield* Effect.fail(
          new UserNotFoundError({
            message: `User not found for id ${payload.userId}`,
            cause: `User not found for id ${payload.userId}`,
          }),
        )
      }

      const user: User = maybeUser.value
      const raw = user.toRaw()

      if (raw.status === 'suspended') {
        return yield* Effect.fail(
          new UserSuspendedError({
            message: 'User account has been suspended',
            cause: 'User account has been suspended',
          }),
        )
      }

      if (raw.status === 'inactive') {
        return yield* Effect.fail(
          new UserInactiveError({
            message: 'User account is inactive',
            cause: 'User account is inactive',
          }),
        )
      }

      const accessToken = yield* JwtUtils.createToken<LoginJwtPayload>(
        { userId: raw.id, role: raw.role },
        { expiresIn: '1h', issuer: 'solverse', secretEnvKey: 'JWT_ACCESS_SECRET' },
      ).pipe(Effect.orDie)

      return { accessToken }
    })
  }
}
