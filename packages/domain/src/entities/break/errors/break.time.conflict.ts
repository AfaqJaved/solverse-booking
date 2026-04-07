import { Schema } from 'effect'

/**
 * Raised when a break time conflicts with another break or working hours.
 */
export class BreakTimeConflictError extends Schema.TaggedError<BreakTimeConflictError>()(
  'BreakTimeConflictError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
