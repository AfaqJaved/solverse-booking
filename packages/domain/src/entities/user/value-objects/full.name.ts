import { Schema } from 'effect';

/**
 * Branded value object representing a user's full name.
 *
 * Both `firstName` and `lastName` are required and capped at 50 characters
 * to prevent oversized display names and DB column overflows.
 *
 * Valid:   { firstName: "John", lastName: "Doe" }
 * Invalid: { firstName: "", lastName: "Doe" } (empty first name)
 *          { firstName: "A".repeat(51), lastName: "X" } (exceeds max length)
 */
export const FullName = Schema.Struct({
  firstName: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(50)),
  lastName: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(50)),
}).pipe(Schema.brand('FullName'));

export type FullName = typeof FullName.Type;

/**
 * Returns a human-readable display name in "First Last" format.
 *
 * @example
 * getDisplayName({ firstName: "John", lastName: "Doe" }) // "John Doe"
 */
export const getDisplayName = (name: FullName): string =>
  `${name.firstName} ${name.lastName}`;
