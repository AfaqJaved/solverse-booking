import { Data } from 'effect';

/**
 * Raised when a database transaction fails and is rolled back.
 */
export class DatabaseTransactionRollbackError extends Data.TaggedError(
  'DatabaseTransactionRollbackError',
)<{
  message: string;
  cause: unknown;
}> {
  readonly sendToFrontend = false;
}
