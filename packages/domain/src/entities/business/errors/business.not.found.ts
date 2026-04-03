import { Schema } from 'effect'

/**
 * Raised when a business cannot be located by the given identifier or slug.
 */
export class BusinessNotFoundError extends Schema.TaggedError<BusinessNotFoundError>()(
  'BusinessNotFoundError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
