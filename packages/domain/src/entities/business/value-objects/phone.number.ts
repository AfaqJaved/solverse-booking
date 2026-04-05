import { Schema } from 'effect'

export const BusinessPhoneNumber = Schema.String.pipe(
  Schema.pattern(/^\+[1-9]\d{7,14}$/, {
    message: () =>
      '@Solverse/Business: phone must be a valid E.164 number (e.g. "+12025551234") — must start with + followed by 8–15 digits',
  }),
  Schema.brand('BusinessPhoneNumber'),
)

export type BusinessPhoneNumber = typeof BusinessPhoneNumber.Type
