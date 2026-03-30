import { Schema } from 'effect';

/**
 * Branded username value object.
 *
 * Usernames must be 3–30 characters, lowercase alphanumeric with underscores
 * or hyphens allowed (but not at start/end). Used as the primary login identifier.
 *
 * Valid:   "john_doe", "user123", "jane-smith"
 * Invalid: "_john" (leading underscore), "jo" (too short), "John Doe" (spaces not allowed)
 */
export const Username = Schema.String.pipe(
  Schema.pattern(/^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$|^[a-z0-9]{3}$/),
  Schema.brand('Username'),
);

export type Username = typeof Username.Type;
