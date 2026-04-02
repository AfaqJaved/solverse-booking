import { Data, Effect } from 'effect'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import path from 'node:path'

export class MigrationError extends Data.TaggedError('MigrationError')<{
  message: string
  cause: unknown
}> {}

export const runMigrations = (
  databaseUrl: string,
): Effect.Effect<void, MigrationError> =>
  Effect.tryPromise({
    try: async () => {
      const pool = new Pool({ connectionString: databaseUrl })
      const db = drizzle(pool)
      await migrate(db, {
        migrationsFolder: path.join(__dirname, '../drizzle'),
      })
      await pool.end()
    },
    catch: (cause) =>
      new MigrationError({
        message:
          cause instanceof Error ? cause.message : 'Unknown migration failure',
        cause,
      }),
  })
