import { Schema } from 'effect'

/**
 * Raised when a login is attempted by a user whose account is inactive.
 * The user must reactivate their account before they can log in again.
 */
export class UserInactiveError extends Schema.TaggedError<UserInactiveError>()(
  'UserInactiveError',
  {
    message: Schema.String,
    cause: Schema.String,
  },
) {
  readonly sendToFrontend = true
}
