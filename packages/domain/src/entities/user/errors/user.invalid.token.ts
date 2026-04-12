import { Schema } from 'effect'

export class UserInvalidTokenError extends Schema.TaggedError<UserInvalidTokenError>()(
  'UserInvalidTokenError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
