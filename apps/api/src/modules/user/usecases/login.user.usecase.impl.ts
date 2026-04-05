import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  LoginUserUsecase,
  User,
  UserId,
  UserInactiveError,
  UserInvalidCredentialsError,
  UserNotFoundError,
  UserRole,
  UserSuspendedError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { JwtUtils } from '../../../lib/jwt/entry'
import { HashUtils } from '../../../lib/hash/entry'
import { LoginJwtPayload } from 'src/lib/jwt/payload/login.jwt.payload'

@Injectable()
export class LoginUserUsecaseImpl implements LoginUserUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

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
    | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const maybeUser =
        yield* this.repositoryFactory.userRepository.findByUsernameOrEmail(
          userNameOrEmail,
        )

      if (Option.isNone(maybeUser)) {
        return yield* Effect.fail(
          new UserNotFoundError({
            message: `User not found against ${userNameOrEmail} `,
            cause: `User not found against ${userNameOrEmail} `,
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

      if (raw.status === 'inactive')
        return yield* Effect.fail(
          new UserInactiveError({
            message: 'User account is inactive',
            cause: 'User account is inactive',
          }),
        )

      const isPasswordValid = yield* HashUtils.verify(
        password,
        raw.password,
      ).pipe(Effect.orDie)

      if (!isPasswordValid) {
        return yield* Effect.fail(
          new UserInvalidCredentialsError({
            message: 'Invalid credentials',
            cause: 'Invalid credentials',
          }),
        )
      }

      const token = yield* JwtUtils.createToken<LoginJwtPayload>(
        { userId: raw.id, role: raw.role },
        { expiresIn: '1h', issuer: 'solverse' },
      ).pipe(Effect.orDie)

      return { token }
    })
  }
}
