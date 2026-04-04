import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  InvalidUserTransitionError,
  ReactivateUserUsecase,
  UserNotFoundError,
  UserSuspendedError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'

@Injectable()
export class ReactivateUserUsecaseImpl implements ReactivateUserUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
  }: {
    userId: UserId
  }): Effect.Effect<
    void,
    | UserNotFoundError
    | UserSuspendedError
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

      const reactivated = yield* maybeUser.value.reactivate()

      yield* this.repositoryFactory.userRepository.save(reactivated)
    })
  }
}
