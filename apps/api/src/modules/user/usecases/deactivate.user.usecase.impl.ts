import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  DeactivateUserUsecase,
  InvalidInputError,
  InvalidUserTransitionError,
  UserNotFoundError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class DeactivateUserUsecaseImpl implements DeactivateUserUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
  }: {
    userId: string
  }): Effect.Effect<
    void,
    InvalidInputError | UserNotFoundError | InvalidUserTransitionError | DatabaseFailure
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

      const deactivated = yield* maybeUser.value.deactivate()

      yield* this.repositoryFactory.userRepository.save(deactivated)
    })
  }
}
