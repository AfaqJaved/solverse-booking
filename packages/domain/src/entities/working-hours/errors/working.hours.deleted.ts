import { Schema } from 'effect'

export class WorkingHoursDeletedError extends Schema.TaggedError<WorkingHoursDeletedError>()(
  'WorkingHoursDeletedError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
