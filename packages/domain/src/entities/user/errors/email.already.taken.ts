import { Schema } from 'effect'

/**
 * Raised when attempting to register or change to an email address
 * that is already associated with another account.
 */
export class EmailAlreadyTakenError extends Schema.TaggedError<EmailAlreadyTakenError>()(
  'EmailAlreadyTakenError',
  {
    message: Schema.String,
    cause: Schema.String,
  },
) {
  readonly sendToFrontEnd = true
}
