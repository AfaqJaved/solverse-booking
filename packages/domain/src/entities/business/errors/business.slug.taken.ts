import { Schema } from 'effect'

/**
 * Raised when the requested slug is already in use by another business.
 * Slugs must be globally unique as they appear in public booking URLs.
 */
export class BusinessSlugTakenError extends Schema.TaggedError<BusinessSlugTakenError>()(
  'BusinessSlugTakenError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
