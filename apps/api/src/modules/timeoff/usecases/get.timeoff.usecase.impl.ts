import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  GetTimeOffUsecase,
  TimeOffId,
  BusinessId,
  TimeOff,
  InvalidInputError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class GetTimeOffUsecaseImpl implements GetTimeOffUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    id,
    businessId,
  }: {
    id: string
    businessId: string
  }): Effect.Effect<
    Option.Option<TimeOff>,
    InvalidInputError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      // Decode and validate inputs
      const decodedId = yield* decodeOrFail(TimeOffId)(id)
      const decodedBusinessId = yield* decodeOrFail(BusinessId)(businessId)

      // Find time off by ID
      const timeOffOption =
        yield* this.repositoryFactory.timeOffRepository.findById(decodedId)

      // Filter by business ID
      return Option.flatMap(timeOffOption, (timeOff) => {
        // Check if the time off belongs to the specified business
        if (timeOff.businessId !== decodedBusinessId) {
          return Option.none<TimeOff>()
        }
        return Option.some(timeOff)
      })
    })
  }
}
