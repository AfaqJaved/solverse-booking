import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  DeactivateUserUsecase,
  InvalidUserTransitionError,
  UserNotFoundError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'

@Injectable()
export class DeactivateUserUsecaseImpl implements DeactivateUserUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
  }: {
    userId: UserId
  }): Effect.Effect<
    void,
    UserNotFoundError | InvalidUserTransitionError | DatabaseFailure
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

      const deactivated = yield* maybeUser.value.deactivate()

      yield* this.repositoryFactory.userRepository.save(deactivated)
    })
  }
}
