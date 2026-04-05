import { Schema } from 'effect'

/**
 * The day of the week for a working hours record.
 *
 * Uses full lowercase names to avoid ambiguity with numeric representations.
 */
const VALID_DAYS_OF_WEEK: readonly string[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export type DayOfWeekType =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export const DayOfWeek = Schema.String.pipe(
  Schema.filter(
    (s): s is DayOfWeekType => VALID_DAYS_OF_WEEK.includes(s),
    {
      message: () =>
        '@Solverse/WorkingHours: dayOfWeek must be one of "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", or "sunday"',
    },
  ),
)

export type DayOfWeek = typeof DayOfWeek.Type
