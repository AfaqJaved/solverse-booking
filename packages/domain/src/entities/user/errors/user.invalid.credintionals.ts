import { Schema } from 'effect'

/**
 * Raised when a user provides invalid credentials during authentication
 * (e.g. wrong password or unrecognized email/username).
 *
 * @field identifier - The email or username that was used in the failed attempt.
 * @field reason    - A human-readable explanation of why the credentials were rejected.
 */
export class UserInvalidCredentialsError extends Schema.TaggedError<UserInvalidCredentialsError>()(
  'UserInvalidCredentialsError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
