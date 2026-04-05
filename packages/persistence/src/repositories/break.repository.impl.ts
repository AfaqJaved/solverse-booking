import { Effect } from 'effect'
import { eq } from 'drizzle-orm'
import {
  Break,
  BreakId,
  BreakRepository,
  DatabaseFailure,
  WorkingHoursId,
} from '@solverse/domain'
import { PersistenceMapperFactory } from '../mappers/persistence.mapper.factory'
import { breaksTable } from '../schema/break.table'
import { dbEffect, db } from '../connection/entry'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BreakRepositoryImpl implements BreakRepository {
  constructor(
    private readonly persistenceMapperFactory: PersistenceMapperFactory,
  ) {}

  findByWorkingHoursId(
    workingHoursId: WorkingHoursId,
  ): Effect.Effect<Break[], DatabaseFailure> {
    return Effect.gen(this, function* () {
      const rows = yield* dbEffect(
        db
          .select()
          .from(breaksTable)
          .where(eq(breaksTable.workingHoursId, workingHoursId)),
      )
      return yield* Effect.all(
        rows.map((row) =>
          this.persistenceMapperFactory.breakPersistenceMapper.toDomain(row),
        ),
      )
    })
  }

  save(breakEntity: Break): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const row =
        this.persistenceMapperFactory.breakPersistenceMapper.toPersistence(
          breakEntity,
        )
      yield* dbEffect(
        db
          .insert(breaksTable)
          .values(row)
          .onConflictDoUpdate({ target: breaksTable.id, set: row }),
      )
    })
  }

  delete(id: BreakId): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      yield* dbEffect(db.delete(breaksTable).where(eq(breaksTable.id, id)))
    })
  }
}
