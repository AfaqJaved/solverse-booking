import { Schema } from 'effect'

/**
 * The day of the week for a working hours record.
 *
 * Uses full lowercase names to avoid ambiguity with numeric representations.
 */
export const DayOfWeek = Schema.Literal(
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
)

export type DayOfWeek = typeof DayOfWeek.Type
