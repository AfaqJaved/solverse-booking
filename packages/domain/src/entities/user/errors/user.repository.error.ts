import { Data } from 'effect';

/**
 * Wraps all errors that originate from the repository layer.
 * `cause` holds the underlying infra error (e.g. DatabaseFailure from @solverse/persistence).
 * Use `sendToFrontend` to control whether the error should be surfaced to the client.
 */
export class UserRepositoryError extends Data.TaggedError('UserRepositoryError')<{
  message: string;
  cause: unknown;
  sendToFrontend: boolean;
}> {}
