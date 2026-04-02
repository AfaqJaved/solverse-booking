require('dotenv').config({ path: '../../.env' })
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SolverseApiModule } from './app.module'
import { runMigrations } from '@solverse/persistence'
import { Config, Effect } from 'effect'
import { GlobalExceptionFilter } from './lib/filters/global.exception.filter'

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'] as const

function validateEnv(): Effect.Effect<void, never, never> {
  return Effect.gen(function* () {
    const missing: string[] = []

    for (const key of requiredEnvVars) {
      const result = yield* Effect.either(Config.nonEmptyString(key))
      if (result._tag === 'Left') missing.push(key)
    }

    if (missing.length > 0) {
      yield* Effect.die(
        new Error(
          `Server startup aborted. Missing required environment variables: ${missing.join(', ')}`,
        ),
      )
    }
  })
}

async function migrate(): Promise<void> {
  const databaseUrl = await Effect.runPromise(
    Config.nonEmptyString('DATABASE_URL'),
  )
  console.log('Running database migrations...')
  await Effect.runPromise(
    runMigrations(databaseUrl).pipe(
      Effect.tapError((e) =>
        Effect.sync(() =>
          console.error(`Migration failed: ${e.message}`, e.cause),
        ),
      ),
    ),
  )
  console.log('Migrations complete.')
}

async function bootstrap() {
  await Effect.runPromise(validateEnv())

  const runMigrationsFlag = await Effect.runPromise(
    Config.boolean('RUN_MIGRATIONS').pipe(Config.withDefault(false)),
  )

  if (runMigrationsFlag) {
    await migrate()
  }

  const app = await NestFactory.create(SolverseApiModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.useGlobalFilters(new GlobalExceptionFilter())
  await app.listen(process.env.PORT ?? 3000)
}

void bootstrap()
