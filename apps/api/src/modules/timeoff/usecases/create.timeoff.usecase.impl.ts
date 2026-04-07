import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  InvalidInputError,
  BusinessId,
  TimeOffLabel,
  TimeOffCadence,
  CreateTimeOffUsecase,
  TimeOffDateRangeError,
  TimeOffTimeRangeError,
  TimeOffAlreadyActiveError,
  TimeOffAlreadyCancelledError,
  TimeOffDeletedError,
  TimeOffId,
  UserId,
  TimeOff,
  TimeOffTimeOfDay as TimeOffTimeOfDaySchema,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class CreateTimeOffUsecaseImpl implements CreateTimeOffUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    businessId,
    label,
    allDay,
    cadence,
    startDate,
    endDate,
    startTime,
    endTime,
    actorId,
  }: {
    businessId: string
    label: string
    allDay: boolean
    cadence: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
    startDate: Date
    endDate: Date
    startTime?: string | null
    endTime?: string | null
    actorId: string | null
  }): Effect.Effect<
    { id: string },
    | InvalidInputError
    | TimeOffDateRangeError
    | TimeOffTimeRangeError
    | TimeOffAlreadyActiveError
    | TimeOffAlreadyCancelledError
    | TimeOffDeletedError
    | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      // Generate ID
      const id = yield* decodeOrFail(TimeOffId)(crypto.randomUUID())

      // Decode and validate inputs
      const decodedBusinessId = yield* decodeOrFail(BusinessId)(businessId)
      const decodedLabel = yield* decodeOrFail(TimeOffLabel)(label)
      const decodedCadence = yield* decodeOrFail(TimeOffCadence)(cadence)
      const decodedActorId = actorId
        ? yield* decodeOrFail(UserId)(actorId)
        : null

      // Validate time fields based on allDay flag
      let decodedStartTime: typeof TimeOffTimeOfDaySchema.Type | null = null
      let decodedEndTime: typeof TimeOffTimeOfDaySchema.Type | null = null

      if (!allDay) {
        // When allDay is false, both startTime and endTime are required
        if (!startTime || !endTime) {
          return yield* Effect.fail(
            new InvalidInputError({
              message:
                'startTime and endTime are required when allDay is false',
              cause: 'Missing required time fields',
            }),
          )
        }

        // Decode time strings to branded types
        decodedStartTime = yield* decodeOrFail(TimeOffTimeOfDaySchema)(
          startTime,
        )
        decodedEndTime = yield* decodeOrFail(TimeOffTimeOfDaySchema)(endTime)

        // Validate time range
        if (startTime >= endTime) {
          return yield* Effect.fail(
            new TimeOffTimeRangeError({
              message: 'startTime must be before endTime',
              startTime,
              endTime,
            }),
          )
        }
      } else {
        // When allDay is true, startTime and endTime should be null
        if (startTime !== null || endTime !== null) {
          return yield* Effect.fail(
            new InvalidInputError({
              message: 'startTime and endTime must be null when allDay is true',
              cause: 'Time fields should be null for all-day time off',
            }),
          )
        }
      }

      // Validate date range
      if (startDate > endDate) {
        return yield* Effect.fail(
          new TimeOffDateRangeError({
            message: 'startDate must be before or equal to endDate',
            startDate,
            endDate,
          }),
        )
      }

      // Check for overlapping time off
      const hasOverlap =
        yield* this.repositoryFactory.timeOffRepository.hasOverlappingTimeOff(
          decodedBusinessId,
          startDate,
          endDate,
          decodedStartTime,
          decodedEndTime,
        )

      if (hasOverlap) {
        return yield* Effect.fail(
          new InvalidInputError({
            message:
              'Time off overlaps with existing time off for this business',
            cause: 'Overlapping time off',
          }),
        )
      }

      // Create the time off aggregate using the domain's static create method
      const timeOff = yield* TimeOff.create({
        id,
        businessId: decodedBusinessId,
        label: decodedLabel,
        allDay,
        cadence: decodedCadence,
        startDate,
        endDate,
        startTime: decodedStartTime,
        endTime: decodedEndTime,
      })

      // Save to repository
      yield* this.repositoryFactory.timeOffRepository.save(timeOff)

      return { id: timeOff.id }
    })
  }
}
