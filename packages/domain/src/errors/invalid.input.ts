import { Data } from 'effect'

/**
 * Raised when input provided to a use case fails domain validation
 * (e.g. malformed UUID, invalid email format, bad timezone string).
 *
 * This is the domain-level equivalent of a 400 Bad Request — it signals
 * that the caller supplied data that cannot be decoded into a valid value object.
 */
export class InvalidInputError extends Data.TaggedError('InvalidInputError')<{
  message: string
  cause: string
}> {
  readonly sendToFrontEnd = true
}
