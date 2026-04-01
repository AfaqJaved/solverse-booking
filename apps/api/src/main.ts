require('dotenv').config({ path: '../../.env' });
import { NestFactory } from '@nestjs/core';
import { SolverseApiModule } from './app.module';
import { runMigrations } from '@solverse/persistence';
import { Config, Effect } from 'effect';



async function migrate(): Promise<void> {
  const databaseUrl = await Effect.runPromise(Config.nonEmptyString('DATABASE_URL'));
  console.log('Running database migrations...');
  await Effect.runPromise(
    runMigrations(databaseUrl).pipe(
      Effect.tapError((e) => Effect.sync(() => console.error(`Migration failed: ${e.message}`, e.cause))),
    ),
  );
  console.log('Migrations complete.');
}

async function bootstrap() {
  const runMigrationsFlag = await Effect.runPromise(
    Config.boolean('RUN_MIGRATIONS').pipe(Config.withDefault(false)),
  );

  console.log(runMigrationsFlag)
  if (runMigrationsFlag) {
    await migrate();
  }

  const app = await NestFactory.create(SolverseApiModule);
  await app.listen(process.env.PORT ?? 3000);
}


void bootstrap();
