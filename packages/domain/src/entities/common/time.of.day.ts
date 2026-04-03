import { Schema } from 'effect'

export const TimeOfDay = Schema.String.pipe(
  Schema.pattern(/^([01]\d|2[0-3]):[0-5]\d$/),
  Schema.brand('TimeOfDay'),
)

export type TimeOfDay = typeof TimeOfDay.Type
