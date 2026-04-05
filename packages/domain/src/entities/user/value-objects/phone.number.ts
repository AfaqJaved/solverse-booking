import { Schema } from 'effect'

export const UserPhoneNumber = Schema.String.pipe(
  Schema.pattern(/^\+[1-9]\d{7,14}$/, {
    message: () =>
      '@Solverse/User: phone must be a valid E.164 number (e.g. "+12025551234") — must start with + followed by 8–15 digits',
  }),
  Schema.brand('UserPhoneNumber'),
)

export type UserPhoneNumber = typeof UserPhoneNumber.Type
