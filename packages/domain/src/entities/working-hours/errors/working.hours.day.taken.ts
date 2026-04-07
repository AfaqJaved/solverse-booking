import { Schema } from 'effect'

export class WorkingHoursDayTakenError extends Schema.TaggedError<WorkingHoursDayTakenError>()(
  'WorkingHoursDayTakenError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
