import { Schema } from 'effect'

/**
 * Raised when a status transition is not permitted by domain rules.
 *
 * @example
 * // Trying to deactivate an already-inactive user
 * new InvalidUserTransitionError({ from: "inactive", to: "inactive" })
 */
export class InvalidUserTransitionError extends Schema.TaggedError<InvalidUserTransitionError>()(
  'InvalidUserTransitionError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
