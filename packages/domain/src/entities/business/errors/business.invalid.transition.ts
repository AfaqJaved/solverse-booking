import { Schema } from 'effect'

/**
 * Raised when a status transition is not permitted by domain rules.
 *
 * @example
 * // Trying to deactivate an already-inactive business
 * new InvalidBusinessTransitionError({ message: "...", cause: "..." })
 */
export class InvalidBusinessTransitionError extends Schema.TaggedError<InvalidBusinessTransitionError>()(
  'InvalidBusinessTransitionError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
