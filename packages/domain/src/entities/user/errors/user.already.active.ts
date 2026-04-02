import { Schema } from 'effect'

/**
 * Raised when attempting to activate a user that is already active.
 */
export class UserAlreadyActiveError extends Schema.TaggedError<UserAlreadyActiveError>()(
  'UserAlreadyActiveError',
  {
    message: Schema.String,
    cause: Schema.String,
  },
) {
  readonly sendToFrontEnd = true
}
