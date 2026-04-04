import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  InvalidUserTransitionError,
  SuspendUserUsecase,
  UserNotFoundError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'

@Injectable()
export class SuspendUserUsecaseImpl implements SuspendUserUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
    reason,
  }: {
    userId: UserId
    reason: string
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

      const suspended = yield* maybeUser.value.suspend(reason)

      yield* this.repositoryFactory.userRepository.save(suspended)
    })
  }
}
