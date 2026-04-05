import { Injectable } from '@nestjs/common'
import {
  ChangeEmailUsecase,
  DatabaseFailure,
  UserEmail,
  EmailAlreadyTakenError,
  InvalidInputError,
  UserNotFoundError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class ChangeEmailUsecaseImpl implements ChangeEmailUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
    newEmail,
  }: {
    userId: string
    newEmail: string
  }): Effect.Effect<
    void,
    InvalidInputError | UserNotFoundError | EmailAlreadyTakenError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedUserId = yield* decodeOrFail(UserId)(userId)
      const decodedEmail = yield* decodeOrFail(UserEmail)(newEmail)

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

      const existingByEmail =
        yield* this.repositoryFactory.userRepository.findByEmail(decodedEmail)

      if (Option.isSome(existingByEmail)) {
        return yield* Effect.fail(
          new EmailAlreadyTakenError({
            message: `Email ${decodedEmail} is already taken`,
            cause: `Email ${decodedEmail} is already taken`,
          }),
        )
      }

      const updated = yield* maybeUser.value.changeEmail(decodedEmail)

      yield* this.repositoryFactory.userRepository.save(updated)
    })
  }
}
