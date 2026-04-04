import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  GetUserUsecase,
  SafeUserData,
  UserNotFoundError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'

@Injectable()
export class GetUserUsecaseImpl implements GetUserUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
  }: {
    userId: UserId
  }): Effect.Effect<SafeUserData, UserNotFoundError | DatabaseFailure> {
    return Effect.gen(this, function* () {
      const maybeUser =
        yield* this.repositoryFactory.userRepository.findById(userId)

      if (Option.isNone(maybeUser)) {
        return yield* Effect.fail(
          new UserNotFoundError({
            message: `User not found: ${userId}`,
            cause: `User not found: ${userId}`,
          }),
        )
      }

      const raw = maybeUser.value.toRaw()

      return {
        id: raw.id,
        username: raw.username,
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        role: raw.role,
        status: raw.status,
        timezone: raw.timezone,
        avatarUrl: raw.avatarUrl,
        emailVerified: raw.emailVerified,
        notificationPreferences: raw.notificationPreferences,
        lastLoginAt: raw.lastLoginAt,
        createdAt: raw.createdAt,
      }
    })
  }
}
