import { Effect, Schema } from 'effect'
import type { ParseError } from 'effect/ParseResult'
import { BusinessId } from '../business/entry'
import {
  ServiceId,
  ServiceName,
  ServiceDuration,
  ServicePrice,
  ServiceStatus,
} from './entry'
import { ServiceDeletedError } from './errors/entry'
import type { ServiceData } from './service.entity'
import { ServiceSchema } from './service.entity'

/**
 * Service aggregate root for the appointment scheduling domain.
 *
 * Represents a bookable offering — a named, priced, time-bounded activity
 * that customers can schedule with a business.
 *
 * Instances are always valid — the private constructor prevents constructing
 * a Service without going through `Service.create` or `Service.fromRaw`.
 *
 * All mutation methods return a new `Service` instance (immutable updates)
 * and wrap fallible operations in `Effect` with typed errors.
 *
 * @example
 * const svc = Service.create({ id, businessId, name, duration, price, createdBy })
 * const updated = yield* svc.updateDetails({ name: newName })
 */
export class Service {
  private constructor(private readonly data: ServiceData) {}

  // ── Identity ───────────────────────────────────────────────────────────────

  /** Unique identifier for this service. */
  get id(): ServiceId {
    return this.data.id
  }

  /** UUID of the Business that owns this service. */
  get businessId(): BusinessId {
    return this.data.businessId
  }

  /** Display name shown to customers on the booking page. */
  get name(): ServiceName {
    return this.data.name
  }

  /** Optional description of what the service includes. */
  get description(): string | null {
    return this.data.description
  }

  /** Duration in minutes — the time shown to customers. */
  get duration(): ServiceDuration {
    return this.data.duration
  }

  /** Buffer time in minutes added after the appointment — invisible to customers. */
  get bufferTime(): number {
    return this.data.bufferTime
  }

  /** Total slot length in minutes: duration + bufferTime. */
  get totalSlotDuration(): number {
    return this.data.duration + this.data.bufferTime
  }

  /** Price in the smallest currency unit (e.g. cents for USD) — 0 for free. */
  get price(): ServicePrice {
    return this.data.price
  }

  /** Current visibility and bookability status. */
  get status(): ServiceStatus {
    return this.data.status
  }

  /** Optional hex color for calendar display (e.g. "#FF5733"). */
  get color(): string | null {
    return this.data.color
  }

  /** Maximum concurrent bookings allowed for the same time slot. */
  get maxBookingsPerSlot(): number {
    return this.data.maxBookingsPerSlot
  }

  /** Whether this service has been soft-deleted. */
  get isDeleted(): boolean {
    return this.data.isDeleted
  }

  // ── Factory ────────────────────────────────────────────────────────────────

  /**
   * Creates a brand-new Service with safe defaults.
   *
   * - Status defaults to `active`
   * - bufferTime defaults to `0`
   * - maxBookingsPerSlot defaults to `1`
   * - Audit fields are initialised; `createdBy` is required
   *
   * @param params - Required fields to initialize the service
   */
  static create(params: {
    id: ServiceId
    businessId: BusinessId
    name: ServiceName
    duration: ServiceDuration
    price: ServicePrice
    createdBy: ServiceData['createdBy']
    description?: string | null
    bufferTime?: number
    color?: string | null
    maxBookingsPerSlot?: number
    status?: ServiceStatus
  }): Service {
    const now = new Date()
    return new Service({
      id: params.id,
      businessId: params.businessId,
      name: params.name,
      description: params.description ?? null,
      duration: params.duration,
      bufferTime: params.bufferTime ?? 0,
      price: params.price,
      status: params.status ?? 'active',
      color: params.color ?? null,
      maxBookingsPerSlot: params.maxBookingsPerSlot ?? 1,
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
   * Reconstitutes a Service from raw untrusted data (e.g. database row, API payload).
   *
   * Decodes and validates the input against `ServiceSchema`. Use this at system
   * boundaries only — never deep inside domain or application logic.
   *
   * @returns `Effect<Service, ParseError>` — fails with a structured parse error if invalid
   */
  static fromRaw(raw: unknown): Effect.Effect<Service, ParseError, never> {
    return Schema.decodeUnknown(ServiceSchema)(raw).pipe(
      Effect.map((data) => new Service(data)),
    )
  }

  // ── Behaviour ──────────────────────────────────────────────────────────────

  /**
   * Updates the customer-facing and scheduling details of the service.
   *
   * Only provided keys are overwritten — omitted keys remain unchanged.
   *
   * @param details   - Partial details to apply
   * @param updatedBy - Actor making the change
   * @fails `ServiceDeletedError` — if soft-deleted
   */
  updateDetails(
    details: Partial<{
      name: ServiceName
      description: string | null
      duration: ServiceDuration
      bufferTime: number
      price: ServicePrice
      color: string | null
      maxBookingsPerSlot: number
    }>,
    updatedBy: ServiceData['updatedBy'],
  ): Effect.Effect<Service, ServiceDeletedError> {
    if (this.data.isDeleted) {
      return Effect.fail(
        new ServiceDeletedError({
          message: `Cannot update a deleted service "${this.data.name}"`,
          cause: `Cannot update a deleted service "${this.data.name}"`,
        }),
      )
    }
    return Effect.succeed(
      new Service({
        ...this.data,
        ...details,
        updatedAt: new Date(),
        updatedBy,
      }),
    )
  }

  /**
   * Makes the service visible and bookable by customers.
   *
   * @param updatedBy - Actor performing the activation
   * @fails `ServiceDeletedError` — if soft-deleted
   */
  activate(
    updatedBy: ServiceData['updatedBy'],
  ): Effect.Effect<Service, ServiceDeletedError> {
    if (this.data.isDeleted) {
      return Effect.fail(
        new ServiceDeletedError({
          message: `Cannot activate a deleted service "${this.data.name}"`,
          cause: `Cannot activate a deleted service "${this.data.name}"`,
        }),
      )
    }
    return Effect.succeed(
      new Service({
        ...this.data,
        status: 'active',
        updatedAt: new Date(),
        updatedBy,
      }),
    )
  }

  /**
   * Hides the service from customers — no new bookings can be made.
   *
   * Existing appointments are not affected.
   *
   * @param updatedBy - Actor performing the deactivation
   * @fails `ServiceDeletedError` — if soft-deleted
   */
  deactivate(
    updatedBy: ServiceData['updatedBy'],
  ): Effect.Effect<Service, ServiceDeletedError> {
    if (this.data.isDeleted) {
      return Effect.fail(
        new ServiceDeletedError({
          message: `Cannot deactivate a deleted service "${this.data.name}"`,
          cause: `Cannot deactivate a deleted service "${this.data.name}"`,
        }),
      )
    }
    return Effect.succeed(
      new Service({
        ...this.data,
        status: 'inactive',
        updatedAt: new Date(),
        updatedBy,
      }),
    )
  }

  /**
   * Soft-deletes the service.
   *
   * Sets `isDeleted = true`, records `deletedAt` and `deletedBy`.
   * Data is retained in the database for audit purposes.
   *
   * @param deletedBy - Actor performing the deletion
   * @fails `ServiceDeletedError` — if already soft-deleted
   */
  softDelete(
    deletedBy: ServiceData['deletedBy'],
  ): Effect.Effect<Service, ServiceDeletedError> {
    if (this.data.isDeleted) {
      return Effect.fail(
        new ServiceDeletedError({
          message: `Service "${this.data.name}" has already been deleted`,
          cause: `Service "${this.data.name}" has already been deleted`,
        }),
      )
    }
    const now = new Date()
    return Effect.succeed(
      new Service({
        ...this.data,
        isDeleted: true,
        deletedAt: now,
        deletedBy,
        updatedAt: now,
        updatedBy: deletedBy,
      }),
    )
  }

  // ── Serialization ──────────────────────────────────────────────────────────

  /**
   * Returns the plain data object for persistence or event emission.
   * Use `Service.fromRaw` to reconstitute back into an aggregate.
   */
  toRaw(): ServiceData {
    return this.data
  }
}
