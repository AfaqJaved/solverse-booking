import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  InvalidInputError,
  CancelTimeOffUsecase,
  TimeOffId,
  BusinessId,
  UserId,
  TimeOffAlreadyCancelledError,
  TimeOffDeletedError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class CancelTimeOffUsecaseImpl implements CancelTimeOffUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    id,
    businessId,
    actorId,
  }: {
    id: string
    businessId: string
    actorId: string | null
  }): Effect.Effect<
    void,
    | InvalidInputError
    | TimeOffAlreadyCancelledError
    | TimeOffDeletedError
    | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      // Decode and validate inputs
      const decodedId = yield* decodeOrFail(TimeOffId)(id)
      const decodedBusinessId = yield* decodeOrFail(BusinessId)(businessId)
      const decodedActorId = actorId
        ? yield* decodeOrFail(UserId)(actorId)
        : null

      // Find the existing time off
      const timeOffOption =
        yield* this.repositoryFactory.timeOffRepository.findById(decodedId)

      const timeOff = yield* Option.match(timeOffOption, {
        onNone: () =>
          Effect.fail(
            new InvalidInputError({
              message: `Time off with ID ${id} not found`,
              cause: 'Time off not found',
            }),
          ),
        onSome: (timeOff) => Effect.succeed(timeOff),
      })

      // Verify the time off belongs to the specified business
      if (timeOff.businessId !== decodedBusinessId) {
        return yield* Effect.fail(
          new InvalidInputError({
            message: 'Time off does not belong to the specified business',
            cause: 'Business ID mismatch',
          }),
        )
      }

      // Cancel the time off
      const cancelledTimeOff = yield* timeOff.cancel(decodedActorId)

      // Save the cancelled time off
      yield* this.repositoryFactory.timeOffRepository.save(cancelledTimeOff)
    })
  }
}
