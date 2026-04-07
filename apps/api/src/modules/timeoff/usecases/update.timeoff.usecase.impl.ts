import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  InvalidInputError,
  UpdateTimeOffUsecase,
  TimeOffId,
  BusinessId,
  TimeOffLabel,
  TimeOffTimeOfDay as TimeOffTimeOfDaySchema,
  TimeOffDateRangeError,
  TimeOffTimeRangeError,
  TimeOffAlreadyActiveError,
  TimeOffAlreadyCancelledError,
  TimeOffDeletedError,
  UserId,
  TimeOff,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class UpdateTimeOffUsecaseImpl implements UpdateTimeOffUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    id,
    businessId,
    label,
    startDate,
    endDate,
    startTime,
    endTime,
    affectsAllServices,
    serviceIds,
    actorId,
  }: {
    id: string
    businessId: string
    label?: string
    startDate?: Date
    endDate?: Date
    startTime?: string | null
    endTime?: string | null
    affectsAllServices?: boolean
    serviceIds?: string[]
    actorId: string | null
  }): Effect.Effect<
    void,
    | InvalidInputError
    | TimeOffDateRangeError
    | TimeOffTimeRangeError
    | TimeOffAlreadyActiveError
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

      // Start with the existing time off
      let updatedTimeOff = timeOff

      // Update label if provided
      if (label !== undefined) {
        const decodedLabel = yield* decodeOrFail(TimeOffLabel)(label)
        updatedTimeOff = updatedTimeOff.updateLabel(
          decodedLabel,
          decodedActorId,
        )
      }

      // Update date range if provided
      if (startDate !== undefined && endDate !== undefined) {
        updatedTimeOff = yield* updatedTimeOff.updateDateRange(
          startDate,
          endDate,
          decodedActorId,
        )
      } else if (startDate !== undefined || endDate !== undefined) {
        return yield* Effect.fail(
          new InvalidInputError({
            message: 'Both startDate and endDate must be provided together',
            cause: 'Partial date range update',
          }),
        )
      }

      // Update time range if provided
      if (startTime !== undefined || endTime !== undefined) {
        let decodedStartTime: typeof TimeOffTimeOfDaySchema.Type | null = null
        let decodedEndTime: typeof TimeOffTimeOfDaySchema.Type | null = null

        // Handle time updates based on allDay flag
        if (!updatedTimeOff.allDay) {
          // When not allDay, we need to handle time updates carefully
          if (startTime === undefined && endTime === undefined) {
            // No time update
          } else if (startTime === null || endTime === null) {
            // Cannot set times to null when allDay is false
            return yield* Effect.fail(
              new InvalidInputError({
                message: 'Cannot set times to null when allDay is false',
                cause: 'Invalid time update',
              }),
            )
          } else {
            // Decode time strings
            decodedStartTime =
              startTime !== undefined && startTime !== null
                ? yield* decodeOrFail(TimeOffTimeOfDaySchema)(startTime)
                : updatedTimeOff.startTime
            decodedEndTime =
              endTime !== undefined && endTime !== null
                ? yield* decodeOrFail(TimeOffTimeOfDaySchema)(endTime)
                : updatedTimeOff.endTime

            // Validate that we have both times
            if (!decodedStartTime || !decodedEndTime) {
              return yield* Effect.fail(
                new InvalidInputError({
                  message:
                    'Both startTime and endTime are required when allDay is false',
                  cause: 'Missing time fields',
                }),
              )
            }
          }
        } else {
          // When allDay is true, times must be null
          if (startTime !== null || endTime !== null) {
            return yield* Effect.fail(
              new InvalidInputError({
                message: 'Cannot set times when allDay is true',
                cause: 'Invalid time update for all-day time off',
              }),
            )
          }
        }

        // Update time range
        updatedTimeOff = yield* updatedTimeOff.updateTimeRange(
          decodedStartTime,
          decodedEndTime,
          decodedActorId,
        )
      }

      // Check for overlapping time off (excluding the current one)
      const hasOverlap =
        yield* this.repositoryFactory.timeOffRepository.hasOverlappingTimeOff(
          decodedBusinessId,
          updatedTimeOff.startDate,
          updatedTimeOff.endDate,
          updatedTimeOff.startTime,
          updatedTimeOff.endTime,
          decodedId, // Exclude current time off
        )

      if (hasOverlap) {
        return yield* Effect.fail(
          new InvalidInputError({
            message:
              'Updated time off overlaps with existing time off for this business',
            cause: 'Overlapping time off',
          }),
        )
      }

      // Save the updated time off
      yield* this.repositoryFactory.timeOffRepository.save(updatedTimeOff)
    })
  }
}
