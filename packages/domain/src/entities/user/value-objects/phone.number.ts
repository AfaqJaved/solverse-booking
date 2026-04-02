import { Schema } from 'effect'

/**
 * Branded E.164 phone number value object.
 *
 * E.164 is the international standard for phone numbers — must start
 * with a `+` followed by a country code and subscriber number,
 * with 8–15 digits total (no spaces, dashes, or parentheses).
 *
 * Valid:   "+12025551234" (US), "+447911123456" (UK), "+923001234567" (PK)
 * Invalid: "12025551234" (missing +), "+1234" (too short), "+1 202 555 1234" (spaces not allowed)
 */
export const PhoneNumber = Schema.String.pipe(
  Schema.pattern(/^\+[1-9]\d{7,14}$/),
  Schema.brand('PhoneNumber'),
)

export type PhoneNumber = typeof PhoneNumber.Type
