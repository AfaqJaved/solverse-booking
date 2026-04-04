import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  EmailNotVerifiedError,
  InvalidUserTransitionError,
  UserNotFoundError,
  UserId,
  VerifyEmailUsecase,
  UserAlreadyActiveError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'

@Injectable()
export class VerifyEmailUsecaseImpl implements VerifyEmailUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
  }: {
    userId: UserId
  }): Effect.Effect<
    void,
    | UserNotFoundError
    | UserAlreadyActiveError
    | EmailNotVerifiedError
    | InvalidUserTransitionError
    | DatabaseFailure
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

      const verified = yield* maybeUser.value.verifyEmail()
      const activated = yield* verified.activate()

      yield* this.repositoryFactory.userRepository.save(activated)
    })
  }
}
