import { Schema } from 'effect'
import { BusinessId } from '../business/entry'
import { AuditSchema } from '../common/entry'
import {
  ServiceId,
  ServiceName,
  ServiceDuration,
  ServicePrice,
  ServiceStatus,
} from './entry'

/**
 * Effect Schema for the raw Service data shape.
 *
 * Used at system boundaries (database reads, API payloads, domain events)
 * to parse and validate untrusted data before constructing a `Service` aggregate.
 * Never use this schema deep inside domain logic — decode at the edges only.
 */
export const ServiceSchema = Schema.Struct({
  /** Unique identifier — UUID v4 */
  id: ServiceId,
  /** UUID v4 of the Business that offers this service */
  businessId: BusinessId,
  /** Display name shown to customers on the booking page */
  name: ServiceName,
  /** Optional description of what the service includes */
  description: Schema.NullOr(Schema.String.pipe(Schema.maxLength(500))),
  /** Duration of the service in minutes (5–480) — the time shown to customers */
  duration: ServiceDuration,
  /** Buffer time added after the appointment in minutes — invisible to customers, defaults to 0 */
  bufferTime: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
  /** Price in the smallest currency unit (e.g. cents for USD) — 0 for free services */
  price: ServicePrice,
  /** Whether the service is visible and bookable by customers */
  status: ServiceStatus,
  /** Optional hex color used to distinguish the service on calendars (e.g. "#FF5733") */
  color: Schema.NullOr(Schema.String.pipe(Schema.pattern(/^#[0-9A-Fa-f]{6}$/))),
  /** Maximum concurrent bookings allowed for the same time slot — defaults to 1 */
  maxBookingsPerSlot: Schema.Int.pipe(Schema.greaterThanOrEqualTo(1)),
  /** Shared audit trail fields (createdAt/By, updatedAt/By, deletedAt/By, isDeleted) */
  ...AuditSchema.fields,
})

/** Plain data type inferred from `ServiceSchema` — used internally by the aggregate. */
export type ServiceData = typeof ServiceSchema.Type
