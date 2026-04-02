import { Schema } from 'effect'

/**
 * Raised when an action requires a verified email but the user has not
 * completed email verification yet (e.g. trying to activate an account).
 */
export class EmailNotVerifiedError extends Schema.TaggedError<EmailNotVerifiedError>()(
  'EmailNotVerifiedError',
  {
    message: Schema.String,
    cause: Schema.String,
  },
) {
  readonly sendToFrontEnd = true
}
