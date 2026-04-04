import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  UpdateProfileUsecase,
  UserNotFoundError,
  UserId,
  NotificationPreferences,
  Timezone,
  PhoneNumber,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'

@Injectable()
export class UpdateProfileUsecaseImpl implements UpdateProfileUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
    timezone,
    phone,
    notificationPreferences,
  }: {
    userId: UserId
    timezone?: Timezone
    phone?: PhoneNumber
    notificationPreferences?: Partial<NotificationPreferences>
  }): Effect.Effect<void, UserNotFoundError | DatabaseFailure> {
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

      let user = maybeUser.value

      if (timezone !== undefined) {
        user = user.updateTimezone(timezone)
      }

      if (phone !== undefined) {
        user = user.updatePhone(phone ?? null)
      }

      if (notificationPreferences !== undefined) {
        user = user.updateNotificationPreferences(notificationPreferences)
      }

      yield* this.repositoryFactory.userRepository.save(user)
    })
  }
}
