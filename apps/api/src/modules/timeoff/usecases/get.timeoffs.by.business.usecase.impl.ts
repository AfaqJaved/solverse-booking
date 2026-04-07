import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  GetTimeOffsByBusinessUsecase,
  BusinessId,
  TimeOff,
  InvalidInputError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class GetTimeOffsByBusinessUsecaseImpl implements GetTimeOffsByBusinessUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    businessId,
    startDate,
    endDate,
    status,
  }: {
    businessId: string
    startDate?: Date
    endDate?: Date
    status?: 'active' | 'cancelled'
  }): Effect.Effect<TimeOff[], InvalidInputError | DatabaseFailure> {
    return Effect.gen(this, function* () {
      // Decode and validate input
      const decodedBusinessId = yield* decodeOrFail(BusinessId)(businessId)

      let timeOffs: TimeOff[]

      if (startDate && endDate && status === 'active') {
        // Use the optimized query for active time offs within date range
        timeOffs =
          yield* this.repositoryFactory.timeOffRepository.findActiveByBusinessIdAndDateRange(
            decodedBusinessId,
            startDate,
            endDate,
          )
      } else {
        // Get all time offs and filter manually
        timeOffs =
          yield* this.repositoryFactory.timeOffRepository.findByBusinessId(
            decodedBusinessId,
          )

        // Apply filters if provided
        if (status) {
          timeOffs = timeOffs.filter((timeOff) => timeOff.status === status)
        }

        if (startDate && endDate) {
          timeOffs = timeOffs.filter((timeOff) => {
            // Check if time off overlaps with the date range
            return (
              (timeOff.startDate <= endDate && timeOff.endDate >= startDate) ||
              (timeOff.startDate >= startDate &&
                timeOff.startDate <= endDate) ||
              (timeOff.endDate >= startDate && timeOff.endDate <= endDate)
            )
          })
        } else if (startDate) {
          timeOffs = timeOffs.filter((timeOff) => timeOff.endDate >= startDate)
        } else if (endDate) {
          timeOffs = timeOffs.filter((timeOff) => timeOff.startDate <= endDate)
        }
      }

      return timeOffs
    })
  }
}
