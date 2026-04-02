import { Data } from 'effect'

/**
 * Raised when a database row cannot be mapped to a valid domain object.
 * This usually indicates data corruption or a schema migration mismatch.
 */
export class PersistenceMappingError extends Data.TaggedError(
  'PersistenceMappingError',
)<{ message: string; cause: unknown }> {
  readonly sendToFrontEnd = false
}
