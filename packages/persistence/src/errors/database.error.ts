import { Data } from 'effect';

/**
 * Generic database error for cases not covered by more specific variants.
 */
export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  message: string;
  cause: unknown;
}> {
  readonly sendToFrontend = false;
}
