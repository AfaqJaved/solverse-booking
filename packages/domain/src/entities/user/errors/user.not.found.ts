import { Schema } from 'effect'

/**
 * Raised when a user lookup by ID yields no result.
 * Typically thrown by the repository layer and propagated to the use case.
 */
export class UserNotFoundError extends Schema.TaggedError<UserNotFoundError>()(
  'UserNotFoundError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
