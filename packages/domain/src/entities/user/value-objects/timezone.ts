import { Schema } from 'effect'

export const UserTimezone = Schema.String.pipe(
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
        '@Solverse/User: timezone must be a valid IANA timezone identifier (e.g. "America/New_York")',
    },
  ),
  Schema.brand('UserTimezone'),
)

export type UserTimezone = typeof UserTimezone.Type
