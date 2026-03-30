import { defineConfig } from 'drizzle-kit';
import { Config, Effect } from 'effect';

// required to pick .env from the root
require('dotenv').config({ path: '../../.env' });

const config = Effect.runSync(
  Effect.gen(function* () {
    const databaseUrl = yield* Config.nonEmptyString('DATABASE_URL');

    return defineConfig({
      out: './drizzle',
      schema: './src/schema/entry.ts',
      dialect: 'postgresql',
      dbCredentials: {
        url: databaseUrl,
      },
    });
  }),
);

export default config;
