import { Schema } from 'effect'

/**
 * Raised when attempting to modify a deleted break.
 */
export class BreakDeletedError extends Schema.TaggedError<BreakDeletedError>()(
  'BreakDeletedError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}