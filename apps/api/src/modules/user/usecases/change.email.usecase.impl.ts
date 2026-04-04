import { Injectable } from '@nestjs/common'
import {
  ChangeEmailUsecase,
  DatabaseFailure,
  EmailAlreadyTakenError,
  UserNotFoundError,
  UserId,
  Email,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'

@Injectable()
export class ChangeEmailUsecaseImpl implements ChangeEmailUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
    newEmail,
  }: {
    userId: UserId
    newEmail: Email
  }): Effect.Effect<
    void,
    UserNotFoundError | EmailAlreadyTakenError | DatabaseFailure
  > {
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

      const existingByEmail =
        yield* this.repositoryFactory.userRepository.findByEmail(newEmail)

      if (Option.isSome(existingByEmail)) {
        return yield* Effect.fail(
          new EmailAlreadyTakenError({
            message: `Email ${newEmail} is already taken`,
            cause: `Email ${newEmail} is already taken`,
          }),
        )
      }

      const updated = yield* maybeUser.value.changeEmail(newEmail)

      yield* this.repositoryFactory.userRepository.save(updated)
    })
  }
}
