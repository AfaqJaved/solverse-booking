import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  EmailNotVerifiedError,
  InvalidInputError,
  InvalidUserTransitionError,
  UserAlreadyActiveError,
  UserNotFoundError,
  UserId,
  VerifyEmailUsecase,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class VerifyEmailUsecaseImpl implements VerifyEmailUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    userId,
  }: {
    userId: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | UserNotFoundError
    | UserAlreadyActiveError
    | EmailNotVerifiedError
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

      const verified = yield* maybeUser.value.verifyEmail()
      const activated = yield* verified.activate()

      yield* this.repositoryFactory.userRepository.save(activated)
    })
  }
}
