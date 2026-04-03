import { Schema } from 'effect'

/**
 * Raised when attempting to activate a business that is already active.
 */
export class BusinessAlreadyActiveError extends Schema.TaggedError<BusinessAlreadyActiveError>()(
  'BusinessAlreadyActiveError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
