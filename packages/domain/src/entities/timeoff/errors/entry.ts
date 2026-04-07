import { Data } from 'effect'
import type { TimeOffId } from '../entry'

/**
 * Error thrown when attempting to cancel an already cancelled time off.
 */
export class TimeOffAlreadyCancelledError extends Data.TaggedError(
  'TimeOffAlreadyCancelledError',
)<{
  message: string
  timeOffId: TimeOffId
}> {}

/**
 * Error thrown when attempting to reactivate an already active time off.
 */
export class TimeOffAlreadyActiveError extends Data.TaggedError(
  'TimeOffAlreadyActiveError',
)<{
  message: string
  timeOffId: TimeOffId
}> {}

/**
 * Error thrown when attempting to operate on a deleted time off.
 */
export class TimeOffDeletedError extends Data.TaggedError(
  'TimeOffDeletedError',
)<{
  message: string
  timeOffId: TimeOffId
}> {}

/**
 * Error thrown when a time off date range is invalid.
 */
export class TimeOffDateRangeError extends Data.TaggedError(
  'TimeOffDateRangeError',
)<{
  message: string
  startDate: Date
  endDate: Date
}> {}

/**
 * Error thrown when a time off time range is invalid.
 */
export class TimeOffTimeRangeError extends Data.TaggedError(
  'TimeOffTimeRangeError',
)<{
  message: string
  startTime: string | null
  endTime: string | null
}> {}

/**
 * Union of all TimeOff-specific errors.
 */
export type TimeOffError =
  | TimeOffAlreadyCancelledError
  | TimeOffAlreadyActiveError
  | TimeOffDeletedError
  | TimeOffDateRangeError
  | TimeOffTimeRangeError
