import { Schema } from 'effect'

/**
 * Raised when attempting to create or update a service with a name
 * that already exists for the same business.
 */
export class ServiceNameTakenError extends Schema.TaggedError<ServiceNameTakenError>()(
  'ServiceNameTakenError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
