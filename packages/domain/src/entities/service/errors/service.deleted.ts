import { Schema } from 'effect'

/**
 * Raised when a mutation is attempted on a soft-deleted service.
 */
export class ServiceDeletedError extends Schema.TaggedError<ServiceDeletedError>()(
  'ServiceDeletedError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
