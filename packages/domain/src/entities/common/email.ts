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
export const Email = Schema.String.pipe(
  Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  Schema.lowercased(),
  Schema.brand('Email'),
)
export type Email = typeof Email.Type
