import { Schema } from 'effect'

/**
 * Raised when a service cannot be located by the given identifier.
 */
export class ServiceNotFoundError extends Schema.TaggedError<ServiceNotFoundError>()(
  'ServiceNotFoundError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
