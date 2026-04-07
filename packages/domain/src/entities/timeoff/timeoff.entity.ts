import { Schema } from 'effect'
import { BusinessId, UserId } from './entry'
import { AuditSchema } from '../common/entry'
import { TimeOffId, TimeOffLabel, TimeOffCadence, TimeOffStatus } from './entry'

/**
 * Effect Schema for the raw TimeOff data shape.
 *
 * Represents when a business is closed and not accepting bookings (holidays, vacations, maintenance, etc.).
 * - Can be single occurrence or repeating with various cadences
 * - Affects booking availability during specified date ranges
 * - Business-wide only (affects all services and staff)
 */
export const TimeOffSchema = Schema.Struct({
  /** Unique identifier — UUID v4 */
  id: TimeOffId.annotations({
    message: () =>
      '@Solverse/TimeOff: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
  }),

  /** FK → businesses.id — the business that is closed during this time off */
  businessId: BusinessId.annotations({
    message: () =>
      '@Solverse/TimeOff: businessId must be a valid business UUID v4',
  }),

  /** Descriptive label for the time off */
  label: TimeOffLabel.annotations({
    message: () =>
      '@Solverse/TimeOff: label must be a string between 1 and 200 characters (e.g. "Christmas Holiday")',
  }),

  /** Whether the time off is for the entire day */
  allDay: Schema.Boolean.annotations({
    message: () => '@Solverse/TimeOff: allDay must be a boolean',
  }),

  /** How the time off repeats */
  cadence: TimeOffCadence.annotations({
    message: () =>
      '@Solverse/TimeOff: cadence must be one of "once", "daily", "weekly", "monthly", or "yearly"',
  }),

  /** Current status of the time off */
  status: TimeOffStatus.annotations({
    message: () =>
      '@Solverse/TimeOff: status must be either "active" or "cancelled"',
  }),

  /** Start date of the time off period (inclusive) */
  startDate: Schema.Date.annotations({
    message: () => '@Solverse/TimeOff: startDate must be a valid Date instance',
  }),

  /** End date of the time off period (inclusive) */
  endDate: Schema.Date.annotations({
    message: () => '@Solverse/TimeOff: endDate must be a valid Date instance',
  }),

  /** Start time of day for time off (HH:MM in 24h format), required when allDay is false */
  startTime: Schema.NullOr(
    Schema.String.pipe(
      Schema.pattern(/^([01]\d|2[0-3]):[0-5]\d$/, {
        message: () =>
          '@Solverse/TimeOff: startTime must be null or a valid HH:MM time in 24-hour format (e.g. "09:00")',
      }),
      Schema.brand('TimeOffTimeOfDay'),
    ),
  ).annotations({
    message: () =>
      '@Solverse/TimeOff: startTime must be null or a valid HH:MM time in 24-hour format (e.g. "09:00")',
  }),

  /** End time of day for time off (HH:MM in 24h format), required when allDay is false */
  endTime: Schema.NullOr(
    Schema.String.pipe(
      Schema.pattern(/^([01]\d|2[0-3]):[0-5]\d$/, {
        message: () =>
          '@Solverse/TimeOff: endTime must be null or a valid HH:MM time in 24-hour format (e.g. "17:30")',
      }),
      Schema.brand('TimeOffTimeOfDay'),
    ),
  ).annotations({
    message: () =>
      '@Solverse/TimeOff: endTime must be null or a valid HH:MM time in 24-hour format (e.g. "17:30")',
  }),

  /** Timestamp when the record was first created */
  createdAt: AuditSchema.fields.createdAt.annotations({
    message: () => '@Solverse/TimeOff: createdAt must be a valid Date instance',
  }),

  /** UserId of the actor who created the record, or null for system-generated records */
  createdBy: AuditSchema.fields.createdBy.annotations({
    message: () =>
      '@Solverse/TimeOff: createdBy must be null or a valid user UUID v4',
  }),

  /** Timestamp of the most recent update */
  updatedAt: AuditSchema.fields.updatedAt.annotations({
    message: () => '@Solverse/TimeOff: updatedAt must be a valid Date instance',
  }),

  /** UserId of the actor who performed the most recent update, or null */
  updatedBy: AuditSchema.fields.updatedBy.annotations({
    message: () =>
      '@Solverse/TimeOff: updatedBy must be null or a valid user UUID v4',
  }),

  /** Soft‑delete timestamp, null while the record is active */
  deletedAt: AuditSchema.fields.deletedAt.annotations({
    message: () =>
      '@Solverse/TimeOff: deletedAt must be null or a valid Date instance',
  }),

  /** UserId of the actor who soft‑deleted the record, or null */
  deletedBy: AuditSchema.fields.deletedBy.annotations({
    message: () =>
      '@Solverse/TimeOff: deletedBy must be null or a valid user UUID v4',
  }),

  /** Fast filter flag for soft‑delete queries */
  isDeleted: AuditSchema.fields.isDeleted.annotations({
    message: () => '@Solverse/TimeOff: isDeleted must be a boolean',
  }),
})

/**
 * Type alias for a validated TimeOff record.
 */
export type TimeOff = Schema.Schema.Type<typeof TimeOffSchema>
