import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  InvalidInputError,
  PhoneNumber,
  Timezone,
  UpdateProfileUsecase,
  UserNotFoundError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class UpdateProfileUsecaseImpl implements UpdateProfileUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
    timezone,
    phone,
    notificationPreferences,
  }: {
    userId: string
    timezone?: string
    phone?: string | null
    notificationPreferences?: { email?: boolean; sms?: boolean; push?: boolean }
  }): Effect.Effect<void, InvalidInputError | UserNotFoundError | DatabaseFailure> {
    return Effect.gen(this, function* () {
      const decodedUserId = yield* decodeOrFail(UserId)(userId)
      const decodedTimezone = timezone != null
        ? yield* decodeOrFail(Timezone)(timezone)
        : undefined
      const decodedPhone = phone != null
        ? yield* decodeOrFail(PhoneNumber)(phone)
        : phone

      const maybeUser =
        yield* this.repositoryFactory.userRepository.findById(decodedUserId)

      if (Option.isNone(maybeUser)) {
        return yield* Effect.fail(
          new UserNotFoundError({
            message: `User not found: ${decodedUserId}`,
            cause: `User not found: ${decodedUserId}`,
          }),
        )
      }

      let user = maybeUser.value

      if (decodedTimezone !== undefined) {
        user = user.updateTimezone(decodedTimezone)
      }

      if (decodedPhone !== undefined) {
        user = user.updatePhone(decodedPhone ?? null)
      }

      if (notificationPreferences !== undefined) {
        user = user.updateNotificationPreferences(notificationPreferences)
      }

      yield* this.repositoryFactory.userRepository.save(user)
    })
  }
}
