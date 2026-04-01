import {
  DrizzleError,
  DrizzleQueryError,
  TransactionRollbackError,
} from 'drizzle-orm/errors';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Config, Effect } from 'effect';
import {
  DatabaseError,
  DatabaseFailure,
  DatabaseQueryError,
  DatabaseTransactionRollbackError,
} from '@solverse/domain';

// --- Effect wrapper ---

export const dbEffect = <T>(
  query: Promise<T>,
): Effect.Effect<T, DatabaseFailure> =>
  Effect.tryPromise({
    try: () => query,
    catch: (
      error:
        | DrizzleQueryError
        | TransactionRollbackError
        | DrizzleError
        | unknown,
    ): DatabaseFailure => {
      if (error instanceof DrizzleQueryError) {
        return new DatabaseQueryError({
          message: error.message,
          query: error.query,
          cause: error.cause,
        });
      }
      if (error instanceof TransactionRollbackError) {
        return new DatabaseTransactionRollbackError({
          message: error.message,
          cause: error,
        });
      }
      if (error instanceof DrizzleError) {
        return new DatabaseError({
          message: error.message,
          cause: error,
        });
      }

      return new DatabaseError({
        message: (error as Error)?.message ?? 'Unknown database error',
        cause: error,
      });
    },
  });

// --- Connection ---

const makeDb = Effect.gen(function* () {
  const databaseUrl = yield* Config.nonEmptyString('DATABASE_URL');
  return drizzle(databaseUrl);
});

export const db = Effect.runSync(makeDb);
