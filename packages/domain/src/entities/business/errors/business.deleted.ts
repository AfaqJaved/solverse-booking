import { Schema } from 'effect'

/**
 * Raised when an action is attempted on a business that has been soft-deleted.
 */
export class BusinessDeletedError extends Schema.TaggedError<BusinessDeletedError>()(
  'BusinessDeletedError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
