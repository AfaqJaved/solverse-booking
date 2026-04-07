import { Schema } from 'effect'

/**
 * Raised when a break cannot be located by the given identifier.
 */
export class BreakNotFoundError extends Schema.TaggedError<BreakNotFoundError>()(
  'BreakNotFoundError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
