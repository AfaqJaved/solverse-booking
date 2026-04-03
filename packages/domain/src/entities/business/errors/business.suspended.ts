import { Schema } from 'effect'

/**
 * Raised when an action is attempted on a suspended business that requires
 * an active account (e.g. accepting new bookings).
 */
export class BusinessSuspendedError extends Schema.TaggedError<BusinessSuspendedError>()(
  'BusinessSuspendedError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
