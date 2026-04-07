import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  InvalidInputError,
  InvalidUserTransitionError,
  SuspendUserUsecase,
  UserNotFoundError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class SuspendUserUsecaseImpl implements SuspendUserUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
    reason,
  }: {
    userId: string
    reason: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | UserNotFoundError
    | InvalidUserTransitionError
    | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedUserId = yield* decodeOrFail(UserId)(userId)

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

      const suspended = yield* maybeUser.value.suspend(reason)

      yield* this.repositoryFactory.userRepository.save(suspended)
    })
  }
}
