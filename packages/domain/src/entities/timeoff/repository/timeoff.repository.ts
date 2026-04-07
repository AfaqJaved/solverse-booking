import { Effect, Option } from 'effect'
import { BusinessId } from '../../business/entry'
import { DatabaseFailure } from '../../../errors/entry'
import { TimeOff } from '../timeoff.aggregate'
import { TimeOffId } from '../entry'

export const ITimeOffRepository = Symbol('ITimeOffRepository')

export interface TimeOffRepository {
  /** Find a time off record by its ID */
  findById(
    id: TimeOffId,
  ): Effect.Effect<Option.Option<TimeOff>, DatabaseFailure>

  /** Find all time off records for a business */
  findByBusinessId(
    businessId: BusinessId,
  ): Effect.Effect<TimeOff[], DatabaseFailure>

  /** Find active time off records for a business within a date range */
  findActiveByBusinessIdAndDateRange(
    businessId: BusinessId,
    startDate: Date,
    endDate: Date,
  ): Effect.Effect<TimeOff[], DatabaseFailure>

  /** Check if a time off record overlaps with existing records for the same business */
  hasOverlappingTimeOff(
    businessId: BusinessId,
    startDate: Date,
    endDate: Date,
    startTime: string | null,
    endTime: string | null,
    excludeId?: TimeOffId,
  ): Effect.Effect<boolean, DatabaseFailure>

  /** Save a time off record (create or update) */
  save(timeOff: TimeOff): Effect.Effect<void, DatabaseFailure>

  /** Delete a time off record */
  delete(id: TimeOffId): Effect.Effect<void, DatabaseFailure>
}
