import { Schema } from 'effect'

/**
 * Branded, lowercase-normalized email address value object.
 *
 * Validates basic email structure (local@domain.tld) and normalizes
 * to lowercase so "User@Example.com" and "user@example.com" are treated
 * as the same address throughout the domain.
 *
 * Valid:   "john.doe@example.com", "user+tag@mail.co.uk", "admin@solverse.io"
 * Invalid: "plainstring", "missing@domain", "@nodomain.com", "spaces @x.com"
 */
export const UserEmail = Schema.String.pipe(
  Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: () =>
      '@Solverse/User: email must be a valid lowercase email address (e.g. "user@example.com")',
  }),
  Schema.lowercased(),
  Schema.brand('UserEmail'),
)
export type UserEmail = typeof UserEmail.Type
