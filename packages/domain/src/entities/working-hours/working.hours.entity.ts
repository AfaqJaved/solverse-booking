import { Schema } from 'effect'
import { AuditSchema } from '../common/entry'
import { WorkingHoursTimeOfDay } from './value-objects/time.of.day'
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
  id: WorkingHoursId.annotations({
    message: () =>
      '@Solverse/WorkingHours: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
  }),
  /** FK → businesses.id — the business this schedule belongs to */
  businessId: BusinessId.annotations({
    message: () =>
      '@Solverse/WorkingHours: businessId must be a valid business UUID v4',
  }),
  /** Day of the week this record covers */
  dayOfWeek: DayOfWeek.annotations({
    message: () =>
      '@Solverse/WorkingHours: dayOfWeek must be one of "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", or "sunday"',
  }),
  /** Whether the business is open on this day */
  isOpen: Schema.Boolean.annotations({
    message: () => '@Solverse/WorkingHours: isOpen must be a boolean',
  }),
  /** Opening time in HH:MM (24h), null when isOpen is false */
  openTime: Schema.NullOr(WorkingHoursTimeOfDay).annotations({
    message: () =>
      '@Solverse/WorkingHours: openTime must be null or a valid HH:MM time in 24-hour format (e.g. "09:00")',
  }),
  /** Closing time in HH:MM (24h), null when isOpen is false */
  closeTime: Schema.NullOr(WorkingHoursTimeOfDay).annotations({
    message: () =>
      '@Solverse/WorkingHours: closeTime must be null or a valid HH:MM time in 24-hour format (e.g. "17:30")',
  }),
  /** Timestamp when the record was first created */
  createdAt: AuditSchema.fields.createdAt.annotations({
    message: () =>
      '@Solverse/WorkingHours: createdAt must be a valid Date instance',
  }),
  /** UserId of the actor who created the record, or null for system-generated records */
  createdBy: AuditSchema.fields.createdBy.annotations({
    message: () =>
      '@Solverse/WorkingHours: createdBy must be null or a valid user UUID v4',
  }),
  /** Timestamp of the most recent update to any field */
  updatedAt: AuditSchema.fields.updatedAt.annotations({
    message: () =>
      '@Solverse/WorkingHours: updatedAt must be a valid Date instance',
  }),
  /** UserId of the actor who last updated the record, or null for system-generated updates */
  updatedBy: AuditSchema.fields.updatedBy.annotations({
    message: () =>
      '@Solverse/WorkingHours: updatedBy must be null or a valid user UUID v4',
  }),
  /** Timestamp when the record was soft-deleted, or null if not deleted */
  deletedAt: AuditSchema.fields.deletedAt.annotations({
    message: () =>
      '@Solverse/WorkingHours: deletedAt must be null or a valid Date instance',
  }),
  /** UserId of the actor who soft-deleted the record, or null if not deleted */
  deletedBy: AuditSchema.fields.deletedBy.annotations({
    message: () =>
      '@Solverse/WorkingHours: deletedBy must be null or a valid user UUID v4',
  }),
  /** Whether the record has been soft-deleted — always filter on this before returning data */
  isDeleted: AuditSchema.fields.isDeleted.annotations({
    message: () => '@Solverse/WorkingHours: isDeleted must be a boolean',
  }),
})

/** Plain data type inferred from `WorkingHoursSchema` — used internally by the aggregate. */
export type WorkingHoursData = typeof WorkingHoursSchema.Type
