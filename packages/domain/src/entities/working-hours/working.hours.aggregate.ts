import { Effect, Schema } from 'effect'
import type { ParseError } from 'effect/ParseResult'
import { UserId } from '../user/entry'
import { BusinessId } from '../business/entry'
import { WorkingHoursId, DayOfWeek } from './entry'
import type { WorkingHoursData } from './working.hours.entity'
import { WorkingHoursSchema } from './working.hours.entity'
import { TimeOfDay } from 'entities/common/time.of.day'

/**
 * WorkingHours aggregate root.
 *
 * Represents one day's schedule for a business (7 records per business, one per day).
 * Enforces that open/close times are present when `isOpen` is true and absent when closed.
 *
 * Instances are always valid — the private constructor prevents construction
 * without going through `WorkingHours.create` or `WorkingHours.fromRaw`.
 *
 * All mutation methods return a new `WorkingHours` instance (immutable updates).
 *
 * @example
 * const wh = WorkingHours.create({ id, businessId, dayOfWeek: 'monday', isOpen: true, openTime: '09:00', closeTime: '17:00' })
 * const closed = wh.setClosed(actorId)
 */
export class WorkingHours {
  private constructor(private readonly data: WorkingHoursData) {}

  // ── Identity ───────────────────────────────────────────────────────────────

  get id(): WorkingHoursId {
    return this.data.id
  }

  get businessId(): BusinessId {
    return this.data.businessId
  }

  get dayOfWeek(): DayOfWeek {
    return this.data.dayOfWeek
  }

  get isOpen(): boolean {
    return this.data.isOpen
  }

  get openTime(): TimeOfDay | null {
    return this.data.openTime
  }

  get closeTime(): TimeOfDay | null {
    return this.data.closeTime
  }

  get isDeleted(): boolean {
    return this.data.isDeleted
  }

  // ── Factory ────────────────────────────────────────────────────────────────

  /**
   * Creates a new WorkingHours record with the given schedule.
   *
   * When `isOpen` is false, `openTime` and `closeTime` are set to null.
   *
   * @param params - Required fields to initialize the working hours
   */
  static create(params: {
    id: WorkingHoursId
    businessId: BusinessId
    dayOfWeek: DayOfWeek
    isOpen: boolean
    openTime?: TimeOfDay | null
    closeTime?: TimeOfDay | null
    createdBy: UserId
  }): WorkingHours {
    const now = new Date()
    const isOpen = params.isOpen
    return new WorkingHours({
      id: params.id,
      businessId: params.businessId,
      dayOfWeek: params.dayOfWeek,
      isOpen,
      openTime: isOpen ? (params.openTime ?? null) : null,
      closeTime: isOpen ? (params.closeTime ?? null) : null,
      createdAt: now,
      createdBy: params.createdBy,
      updatedAt: now,
      updatedBy: params.createdBy,
      deletedAt: null,
      deletedBy: null,
      isDeleted: false,
    })
  }

  /**
   * Reconstitutes a WorkingHours from raw untrusted data (e.g. database row, API payload).
   *
   * @returns `Effect<WorkingHours, ParseError>` — fails with a structured parse error if invalid
   */
  static fromRaw(raw: unknown): Effect.Effect<WorkingHours, ParseError, never> {
    return Schema.decodeUnknown(WorkingHoursSchema)(raw).pipe(
      Effect.map((data) => new WorkingHours(data)),
    )
  }

  // ── Behaviour ──────────────────────────────────────────────────────────────

  /**
   * Marks the day as open with the given hours.
   *
   * @param openTime  - Opening time in HH:MM (24h)
   * @param closeTime - Closing time in HH:MM (24h)
   * @param updatedBy - Actor making the change
   */
  setOpen(
    openTime: TimeOfDay,
    closeTime: TimeOfDay,
    updatedBy: UserId,
  ): WorkingHours {
    return new WorkingHours({
      ...this.data,
      isOpen: true,
      openTime,
      closeTime,
      updatedAt: new Date(),
      updatedBy,
    })
  }

  /**
   * Marks the day as closed, clearing open/close times.
   *
   * @param updatedBy - Actor making the change
   */
  setClosed(updatedBy: UserId): WorkingHours {
    return new WorkingHours({
      ...this.data,
      isOpen: false,
      openTime: null,
      closeTime: null,
      updatedAt: new Date(),
      updatedBy,
    })
  }

  /**
   * Soft-deletes this working hours record.
   *
   * @param deletedBy - Actor performing the deletion
   */
  softDelete(deletedBy: UserId): WorkingHours {
    const now = new Date()
    return new WorkingHours({
      ...this.data,
      isDeleted: true,
      deletedAt: now,
      deletedBy,
      updatedAt: now,
      updatedBy: deletedBy,
    })
  }

  // ── Serialization ──────────────────────────────────────────────────────────

  /**
   * Returns the plain data object for persistence or event emission.
   */
  toRaw(): WorkingHoursData {
    return this.data
  }
}
