import { Schema } from 'effect'

export const BreakTimeOfDay = Schema.String.pipe(
  Schema.pattern(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: () =>
      '@Solverse/Break: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
  }),
  Schema.brand('BreakTimeOfDay'),
)

export type BreakTimeOfDay = typeof BreakTimeOfDay.Type
