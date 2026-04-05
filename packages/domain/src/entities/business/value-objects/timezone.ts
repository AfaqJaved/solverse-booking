import { Schema } from 'effect'

export const BusinessTimezone = Schema.String.pipe(
  Schema.minLength(1),
  Schema.filter(
    (tz) => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: tz })
        return true
      } catch {
        return false
      }
    },
    {
      message: () =>
        '@Solverse/Business: timezone must be a valid IANA timezone identifier (e.g. "America/New_York")',
    },
  ),
  Schema.brand('BusinessTimezone'),
)

export type BusinessTimezone = typeof BusinessTimezone.Type
