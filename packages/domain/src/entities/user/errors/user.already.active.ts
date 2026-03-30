import { Schema } from 'effect';

/**
 * Raised when attempting to activate a user that is already active.
 */
export class UserAlreadyActiveError extends Schema.TaggedError<UserAlreadyActiveError>()(
  'UserAlreadyActiveError',
  { userId: Schema.String },
) {
  readonly sendToFrontend = true;
}
