import { Schema } from 'effect'
import { BusinessId } from '../business/entry'
import { UserId } from '../user/entry'

/**
 * TimeOff Cadence represents how the time off repeats.
 * - `once`: Single occurrence (e.g., vacation day)
 * - `daily`: Repeats every day within date range
 * - `weekly`: Repeats on same day of week within date range
 * - `monthly`: Repeats on same day of month within date range
 * - `yearly`: Repeats on same date every year (e.g., annual holiday)
 */
export const TimeOffCadence = Schema.Literal(
  'once',
  'daily',
  'weekly',
  'monthly',
  'yearly',
)

/**
 * TimeOff Status indicates whether the time off is active or cancelled.
 */
export const TimeOffStatus = Schema.Literal('active', 'cancelled')

/**
 * UUID v4 identifier for TimeOff records.
 */
export const TimeOffId = Schema.UUID.pipe(
  Schema.brand('TimeOffId'),
  Schema.annotations({
    identifier: 'TimeOffId',
    message: () =>
      '@Solverse/TimeOff: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
  }),
)

/**
 * TimeOff label/description (max 200 characters).
 */
export const TimeOffLabel = Schema.String.pipe(
  Schema.minLength(1),
  Schema.maxLength(200),
  Schema.brand('TimeOffLabel'),
  Schema.annotations({
    identifier: 'TimeOffLabel',
    message: () =>
      '@Solverse/TimeOff: label must be a string between 1 and 200 characters (e.g. "Christmas Holiday")',
  }),
)

/**
 * TimeOff cadence type.
 */
export type TimeOffCadence = Schema.Schema.Type<typeof TimeOffCadence>

/**
 * TimeOff status type.
 */
export type TimeOffStatus = Schema.Schema.Type<typeof TimeOffStatus>

/**
 * TimeOff ID type.
 */
export type TimeOffId = Schema.Schema.Type<typeof TimeOffId>

/**
 * TimeOff label type.
 */
export type TimeOffLabel = Schema.Schema.Type<typeof TimeOffLabel>

/**
 * Re-export commonly used types for convenience.
 */
export { BusinessId, UserId }

// Re-export everything from sub-modules
export * from './value-objects/entry'
export * from './errors/entry'
export { TimeOffSchema, type TimeOff as TimeOffData } from './timeoff.entity'
export { TimeOff } from './timeoff.aggregate'
export * from './repository/timeoff.repository'
export * from './usecases/entry'
