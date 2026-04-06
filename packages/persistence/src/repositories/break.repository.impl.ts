import { Effect, Option } from 'effect'
import { eq, and, count, sql } from 'drizzle-orm'
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

  findById(id: BreakId): Effect.Effect<Option.Option<Break>, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const [row] = yield* dbEffect(
        db
          .select()
          .from(breaksTable)
          .where(eq(breaksTable.id, id))
          .limit(1),
      )
      if (!row) return Option.none()
      const breakEntity =
        yield* this.persistenceMapperFactory.breakPersistenceMapper.toDomain(row)
      return Option.some(breakEntity)
    })
  }

  findByWorkingHoursId(
    workingHoursId: WorkingHoursId,
    options?: {
      includeDeleted?: boolean
    }
  ): Effect.Effect<Break[], DatabaseFailure> {
    return Effect.gen(this, function* () {
      const conditions = [eq(breaksTable.workingHoursId, workingHoursId)]
      
      if (options?.includeDeleted !== true) {
        conditions.push(eq(breaksTable.isDeleted, false))
      }
      
      const rows = yield* dbEffect(
        db
          .select()
          .from(breaksTable)
          .where(and(...conditions)),
      )
      return yield* Effect.all(
        rows.map((row) =>
          this.persistenceMapperFactory.breakPersistenceMapper.toDomain(row),
        ),
      )
    })
  }

  countByWorkingHoursId(
    workingHoursId: WorkingHoursId,
    options?: {
      includeDeleted?: boolean
    }
  ): Effect.Effect<number, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const conditions = [eq(breaksTable.workingHoursId, workingHoursId)]
      
      if (options?.includeDeleted !== true) {
        conditions.push(eq(breaksTable.isDeleted, false))
      }
      
      const result = yield* dbEffect(
        db
          .select({ count: count() })
          .from(breaksTable)
          .where(and(...conditions)),
      )
      
      const row = result[0]
      if (!row) {
        return 0
      }
      
      return row.count
    })
  }

  hasTimeConflict(
    workingHoursId: WorkingHoursId,
    startTime: string,
    endTime: string,
    excludeBreakId?: BreakId
  ): Effect.Effect<boolean, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const conditions = [
        eq(breaksTable.workingHoursId, workingHoursId),
        eq(breaksTable.isDeleted, false),
        sql`(
          (${breaksTable.startTime} < ${endTime} AND ${breaksTable.endTime} > ${startTime})
          OR (${breaksTable.startTime} = ${startTime} AND ${breaksTable.endTime} = ${endTime})
        )`,
      ]
      
      if (excludeBreakId) {
        conditions.push(sql`${breaksTable.id} != ${excludeBreakId}`)
      }
      
      const result = yield* dbEffect(
        db
          .select({ exists: sql<boolean>`EXISTS (
            SELECT 1 FROM ${breaksTable}
            WHERE ${and(...conditions)}
            LIMIT 1
          )` })
          .from(breaksTable)
          .limit(1),
      )
      
      const row = result[0]
      if (!row) {
        return false
      }
      
      return row.exists
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
