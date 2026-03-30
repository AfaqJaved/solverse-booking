import { Schema } from 'effect';

/**
 * Branded IANA timezone identifier value object.
 *
 * Validated at runtime using the `Intl.DateTimeFormat` API — only accepts
 * timezone strings that the JS runtime recognizes as valid IANA identifiers.
 * Stored as-is and used for scheduling appointments in the user's local time.
 *
 * Valid:   "America/New_York", "Europe/London", "Asia/Karachi", "UTC"
 * Invalid: "EST" (abbreviations not allowed), "GMT+5" (offset format), "New_York" (missing region)
 */
export const Timezone = Schema.String.pipe(
  Schema.minLength(1),
  Schema.filter(
    (tz) => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
      } catch {
        return false;
      }
    },
    { message: () => 'Invalid IANA timezone' },
  ),
  Schema.brand('Timezone'),
);

export type Timezone = typeof Timezone.Type;
