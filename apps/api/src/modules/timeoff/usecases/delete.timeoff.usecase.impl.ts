import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  InvalidInputError,
  DeleteTimeOffUsecase,
  TimeOffId,
  BusinessId,
  UserId,
  TimeOffDeletedError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class DeleteTimeOffUsecaseImpl implements DeleteTimeOffUsecase {
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
    InvalidInputError | TimeOffDeletedError | DatabaseFailure
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

      // Delete the time off
      const deletedTimeOff = yield* timeOff.delete(decodedActorId)

      // Save the deleted time off
      yield* this.repositoryFactory.timeOffRepository.save(deletedTimeOff)
    })
  }
}
