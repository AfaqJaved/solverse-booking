import { Schema } from 'effect'

/**
 * Raised when working hours cannot be located for the given business or day.
 */
export class WorkingHoursNotFoundError extends Schema.TaggedError<WorkingHoursNotFoundError>()(
  'WorkingHoursNotFoundError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
