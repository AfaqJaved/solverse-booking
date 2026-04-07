import { Effect, Schema } from 'effect'
import type { ParseError } from 'effect/ParseResult'
import { BusinessId, UserId } from './entry'
import {
  TimeOffId,
  TimeOffLabel,
  TimeOffCadence,
  TimeOffStatus,
  TimeOffData,
} from './entry'
import { TimeOffSchema } from './timeoff.entity'
import {
  TimeOffAlreadyActiveError,
  TimeOffAlreadyCancelledError,
  TimeOffDeletedError,
  TimeOffDateRangeError,
  TimeOffTimeRangeError,
} from './errors/entry'

type TimeOffTimeOfDay = TimeOffData['startTime']

/**
 * TimeOff aggregate root for the appointment scheduling domain.
 *
 * Represents when a business is closed and not accepting bookings (holidays, vacations, maintenance, etc.).
 * - Can be single occurrence or repeating with various cadences
 * - Affects booking availability during specified date ranges
 * - Business-wide only (affects all services and staff)
 *
 * Instances are always valid — the private constructor prevents constructing
 * a TimeOff without going through `TimeOff.create` or `TimeOff.fromRaw`.
 *
 * All mutation methods return a new `TimeOff` instance (immutable updates)
 * and wrap fallible operations in `Effect` with typed errors.
 *
 * @example
 * const timeOff = TimeOff.create({ id, businessId, label, type, startDate, endDate })
 * const cancelled = yield* timeOff.cancel()
 */
export class TimeOff {
  private constructor(private readonly data: TimeOffData) {}

  // ── Identity ───────────────────────────────────────────────────────────────

  /** Unique identifier for this time off record. */
  get id(): TimeOffId {
    return this.data.id
  }

  /** Business that is closed during this time off. */
  get businessId(): BusinessId {
    return this.data.businessId
  }

  /** Descriptive label for the time off. */
  get label(): TimeOffLabel {
    return this.data.label
  }

  /** Whether the time off is for the entire day. */
  get allDay(): boolean {
    return this.data.allDay
  }

  /** How the time off repeats. */
  get cadence(): TimeOffCadence {
    return this.data.cadence
  }

  /** Current status of the time off. */
  get status(): TimeOffStatus {
    return this.data.status
  }

  /** Start date of the time off period (inclusive). */
  get startDate(): Date {
    return this.data.startDate
  }

  /** End date of the time off period (inclusive). */
  get endDate(): Date {
    return this.data.endDate
  }

  /** Start time of day (HH:MM), null means all day. */
  get startTime(): TimeOffTimeOfDay | null {
    return this.data.startTime
  }

  /** End time of day (HH:MM), null means all day. */
  get endTime(): TimeOffTimeOfDay | null {
    return this.data.endTime
  }

  /** Whether this time off has been soft-deleted. */
  get isDeleted(): boolean {
    return this.data.isDeleted
  }

  // ── Factory ────────────────────────────────────────────────────────────────

  /**
   * Construct a TimeOff aggregate from validated raw data.
   *
   * This is the only way to obtain a `TimeOff` instance — the constructor is private.
   * Use `TimeOff.create` for new records or `TimeOff.fromRaw` for existing ones.
   */
  private static unsafeFromData(data: TimeOffData): TimeOff {
    return new TimeOff(data)
  }

  /**
   * Parse raw, untrusted data into a validated TimeOff aggregate.
   *
   * Use this when reading from the database or receiving API payloads.
   * Returns an `Effect` that fails with `ParseError` if validation fails.
   */
  static fromRaw(raw: unknown): Effect.Effect<TimeOff, ParseError> {
    return Effect.flatMap(Schema.decodeUnknown(TimeOffSchema)(raw), (data) =>
      Effect.succeed(TimeOff.unsafeFromData(data)),
    )
  }

  /**
   * Create a new TimeOff aggregate with default values for audit fields.
   *
   * Sets `status` to 'active', `isDeleted` to false, and populates
   * `createdAt`/`updatedAt` with the current timestamp.
   *
   * @param input - Required fields for a new time off record
   */
  static create(
    input: Omit<
      TimeOffData,
      | 'status'
      | 'createdAt'
      | 'createdBy'
      | 'updatedAt'
      | 'updatedBy'
      | 'deletedAt'
      | 'deletedBy'
      | 'isDeleted'
      | 'userId'
      | 'affectsAllServices'
      | 'serviceIds'
    >,
  ): Effect.Effect<TimeOff, TimeOffDateRangeError | TimeOffTimeRangeError> {
    return Effect.gen(function* () {
      // Validate date range
      if (input.startDate > input.endDate) {
        return yield* new TimeOffDateRangeError({
          message: 'startDate must be before or equal to endDate',
          startDate: input.startDate,
          endDate: input.endDate,
        })
      }

      // Validate time fields based on allDay flag
      if (!input.allDay) {
        // When allDay is false, both startTime and endTime are required
        if (!input.startTime || !input.endTime) {
          return yield* new TimeOffTimeRangeError({
            message: 'startTime and endTime are required when allDay is false',
            startTime: input.startTime,
            endTime: input.endTime,
          })
        }

        // Validate time range
        if (String(input.startTime) >= String(input.endTime)) {
          return yield* new TimeOffTimeRangeError({
            message: 'startTime must be before endTime when allDay is false',
            startTime: input.startTime,
            endTime: input.endTime,
          })
        }
      } else {
        // When allDay is true, startTime and endTime should be null
        if (input.startTime !== null || input.endTime !== null) {
          return yield* new TimeOffTimeRangeError({
            message: 'startTime and endTime must be null when allDay is true',
            startTime: input.startTime,
            endTime: input.endTime,
          })
        }
      }

      const now = new Date()
      const data: TimeOffData = {
        ...input,
        status: 'active' as const,
        createdAt: now,
        createdBy: null,
        updatedAt: now,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDeleted: false,
      }

      return TimeOff.unsafeFromData(data)
    })
  }

  // ── Business Logic ─────────────────────────────────────────────────────────

  /**
   * Check if this time off is currently active (not cancelled or deleted).
   */
  isActive(): boolean {
    return this.status === 'active' && !this.isDeleted
  }

  /**
   * Check if the given date falls within this time off period.
   *
   * @param date - The date to check
   * @param time - Optional time to check (HH:MM format)
   */
  coversDate(date: Date, time?: string): boolean {
    // Check if date is within range
    if (date < this.startDate || date > this.endDate) {
      return false
    }

    // If no time specified or time off is all day, date is covered
    if (!time || (!this.startTime && !this.endTime)) {
      return true
    }

    // Check time range
    const checkTime = time
    const startTime = this.startTime || '00:00'
    const endTime = this.endTime || '23:59'

    return checkTime >= String(startTime) && checkTime <= String(endTime)
  }

  /**
   * Cancel this time off.
   *
   * Returns a new TimeOff instance with status 'cancelled'.
   * Fails if the time off is already cancelled or deleted.
   */
  cancel(
    actorId: UserId | null,
  ): Effect.Effect<
    TimeOff,
    TimeOffAlreadyCancelledError | TimeOffDeletedError
  > {
    const self = this
    return Effect.gen(function* () {
      if (self.isDeleted) {
        return yield* new TimeOffDeletedError({
          message: 'Cannot cancel a deleted time off',
          timeOffId: self.id,
        })
      }

      if (self.status === 'cancelled') {
        return yield* new TimeOffAlreadyCancelledError({
          message: 'Time off is already cancelled',
          timeOffId: self.id,
        })
      }

      const now = new Date()
      const updated: TimeOffData = {
        ...self.data,
        status: 'cancelled' as const,
        updatedAt: now,
        updatedBy: actorId,
      }

      return TimeOff.unsafeFromData(updated)
    })
  }

  /**
   * Reactivate a cancelled time off.
   *
   * Returns a new TimeOff instance with status 'active'.
   * Fails if the time off is already active or deleted.
   */
  reactivate(
    actorId: UserId | null,
  ): Effect.Effect<TimeOff, TimeOffAlreadyActiveError | TimeOffDeletedError> {
    const self = this
    return Effect.gen(function* () {
      if (self.isDeleted) {
        return yield* new TimeOffDeletedError({
          message: 'Cannot reactivate a deleted time off',
          timeOffId: self.id,
        })
      }

      if (self.status === 'active') {
        return yield* new TimeOffAlreadyActiveError({
          message: 'Time off is already active',
          timeOffId: self.id,
        })
      }

      const now = new Date()
      const updated: TimeOffData = {
        ...self.data,
        status: 'active' as const,
        updatedAt: now,
        updatedBy: actorId,
      }

      return TimeOff.unsafeFromData(updated)
    })
  }

  /**
   * Update the time off label.
   *
   * Returns a new TimeOff instance with updated label.
   */
  updateLabel(label: TimeOffLabel, actorId: UserId | null): TimeOff {
    const now = new Date()
    const updated: TimeOffData = {
      ...this.data,
      label,
      updatedAt: now,
      updatedBy: actorId,
    }

    return TimeOff.unsafeFromData(updated)
  }

  /**
   * Update the time off date range.
   *
   * Returns a new TimeOff instance with updated dates.
   * Fails if the new date range is invalid.
   */
  updateDateRange(
    startDate: Date,
    endDate: Date,
    actorId: UserId | null,
  ): Effect.Effect<TimeOff, TimeOffDateRangeError> {
    const self = this
    return Effect.gen(function* () {
      if (startDate > endDate) {
        return yield* new TimeOffDateRangeError({
          message: 'startDate must be before or equal to endDate',
          startDate,
          endDate,
        })
      }

      const now = new Date()
      const updated: TimeOffData = {
        ...self.data,
        startDate,
        endDate,
        updatedAt: now,
        updatedBy: actorId,
      }

      return TimeOff.unsafeFromData(updated)
    })
  }

  /**
   * Update the time off time range.
   *
   * Returns a new TimeOff instance with updated times.
   * Fails if the new time range is invalid.
   */
  updateTimeRange(
    startTime: TimeOffTimeOfDay | null,
    endTime: TimeOffTimeOfDay | null,
    actorId: UserId | null,
  ): Effect.Effect<TimeOff, TimeOffTimeRangeError> {
    const self = this
    return Effect.gen(function* () {
      // Validate time range when both times are provided
      if (startTime && endTime) {
        if (String(startTime) >= String(endTime)) {
          return yield* new TimeOffTimeRangeError({
            message: 'startTime must be before endTime when both are provided',
            startTime,
            endTime,
          })
        }
      }

      const now = new Date()
      const updated: TimeOffData = {
        ...self.data,
        startTime,
        endTime,
        updatedAt: now,
        updatedBy: actorId,
      }

      return TimeOff.unsafeFromData(updated)
    })
  }

  /**
   * Soft-delete this time off.
   *
   * Returns a new TimeOff instance with `isDeleted` set to true.
   * Fails if the time off is already deleted.
   */
  delete(actorId: UserId | null): Effect.Effect<TimeOff, TimeOffDeletedError> {
    const self = this
    return Effect.gen(function* () {
      if (self.isDeleted) {
        return yield* new TimeOffDeletedError({
          message: 'Time off is already deleted',
          timeOffId: self.id,
        })
      }

      const now = new Date()
      const updated: TimeOffData = {
        ...self.data,
        isDeleted: true,
        deletedAt: now,
        deletedBy: actorId,
        updatedAt: now,
        updatedBy: actorId,
      }

      return TimeOff.unsafeFromData(updated)
    })
  }

  /**
   * Restore a soft-deleted time off.
   *
   * Returns a new TimeOff instance with `isDeleted` set to false.
   * Fails if the time off is not deleted.
   */
  restore(actorId: UserId | null): Effect.Effect<TimeOff, TimeOffDeletedError> {
    const self = this
    return Effect.gen(function* () {
      if (!self.isDeleted) {
        return yield* new TimeOffDeletedError({
          message: 'Time off is not deleted',
          timeOffId: self.id,
        })
      }

      const now = new Date()
      const updated: TimeOffData = {
        ...self.data,
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: now,
        updatedBy: actorId,
      }

      return TimeOff.unsafeFromData(updated)
    })
  }

  // ── Serialization ──────────────────────────────────────────────────────────

  /**
   * Return the raw data backing this aggregate.
   *
   * Useful for persistence or serialization. The returned object is a copy
   * to prevent accidental mutation of the aggregate's internal state.
   */
  toJSON(): TimeOffData {
    return { ...this.data }
  }
}
