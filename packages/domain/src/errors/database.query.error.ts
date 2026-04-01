import { Data } from 'effect';

/**
 * Raised when a database query fails to execute.
 */
export class DatabaseQueryError extends Data.TaggedError('DatabaseQueryError')<{
  message: string;
  query: string | undefined;
  cause: unknown;
}> {
  readonly sendToFrontend = false;
}