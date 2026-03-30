import { Data } from 'effect';
import type { DomainEntityName } from '@solverse/domain';

/**
 * Raised when a database row cannot be mapped to a valid domain object.
 * This usually indicates data corruption or a schema migration mismatch.
 */
export class PersistenceMappingError extends Data.TaggedError(
  'PersistenceMappingError',
)<{
  entity: DomainEntityName;
  message: string;
  cause: unknown;
}> {
  readonly sendToFrontend = false;
}
