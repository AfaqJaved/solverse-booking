import { Schema } from 'effect'
import { AuditSchema, TimeOfDay } from '../common/entry'
import { BusinessId } from '../business/entry'
import { WorkingHoursId, DayOfWeek } from './entry'

/**
 * Effect Schema for the raw WorkingHours data shape.
 *
 * Represents one day's schedule for a business.
 * - `isOpen: false` with null times represents a closed day
 * - `openTime` / `closeTime` are HH:MM in 24-hour format, timezone-agnostic
 */
export const WorkingHoursSchema = Schema.Struct({
  /** Unique identifier — UUID v4 */
  id: WorkingHoursId,
  /** FK → businesses.id — the business this schedule belongs to */
  businessId: BusinessId,
  /** Day of the week this record covers */
  dayOfWeek: DayOfWeek,
  /** Whether the business is open on this day */
  isOpen: Schema.Boolean,
  /** Opening time in HH:MM (24h), null when isOpen is false */
  openTime: Schema.NullOr(TimeOfDay),
  /** Closing time in HH:MM (24h), null when isOpen is false */
  closeTime: Schema.NullOr(TimeOfDay),
  /** Shared audit trail fields */
  ...AuditSchema.fields,
})

/** Plain data type inferred from `WorkingHoursSchema` — used internally by the aggregate. */
export type WorkingHoursData = typeof WorkingHoursSchema.Type
