import { Schema } from 'effect'

/**
 * Raised when an action is attempted on a suspended user that requires
 * an active account (e.g. booking an appointment).
 */
export class UserSuspendedError extends Schema.TaggedError<UserSuspendedError>()(
  'UserSuspendedError',

  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
