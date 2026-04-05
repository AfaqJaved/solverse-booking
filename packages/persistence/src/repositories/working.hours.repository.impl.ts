import { Effect, Option } from 'effect'
import { and, eq } from 'drizzle-orm'
import {
  WorkingHours,
  WorkingHoursId,
  WorkingHoursRepository,
  DayOfWeek,
  DatabaseFailure,
} from '@solverse/domain'
import { BusinessId } from '@solverse/domain'
import { PersistenceMapperFactory } from '../mappers/persistence.mapper.factory'
import { workingHoursTable } from '../schema/working.hours.table'
import { dbEffect, db } from '../connection/entry'
import { Injectable } from '@nestjs/common'

@Injectable()
export class WorkingHoursRepositoryImpl implements WorkingHoursRepository {
  constructor(
    private readonly persistenceMapperFactory: PersistenceMapperFactory,
  ) {}

  findByBusinessId(
    businessId: BusinessId,
  ): Effect.Effect<WorkingHours[], DatabaseFailure> {
    return Effect.gen(this, function* () {
      const rows = yield* dbEffect(
        db
          .select()
          .from(workingHoursTable)
          .where(eq(workingHoursTable.businessId, businessId)),
      )
      return yield* Effect.all(
        rows.map((row) =>
          this.persistenceMapperFactory.workingHoursPersistenceMapper.toDomain(
            row,
          ),
        ),
      )
    })
  }

  findByBusinessIdAndDay(
    businessId: BusinessId,
    day: DayOfWeek,
  ): Effect.Effect<Option.Option<WorkingHours>, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const [row] = yield* dbEffect(
        db
          .select()
          .from(workingHoursTable)
          .where(
            and(
              eq(workingHoursTable.businessId, businessId),
              eq(workingHoursTable.dayOfWeek, day),
            ),
          )
          .limit(1),
      )
      if (!row) return Option.none()
      const workingHours =
        yield* this.persistenceMapperFactory.workingHoursPersistenceMapper.toDomain(
          row,
        )
      return Option.some(workingHours)
    })
  }

  save(workingHours: WorkingHours): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const row =
        this.persistenceMapperFactory.workingHoursPersistenceMapper.toPersistence(
          workingHours,
        )
      yield* dbEffect(
        db
          .insert(workingHoursTable)
          .values(row)
          .onConflictDoUpdate({ target: workingHoursTable.id, set: row }),
      )
    })
  }

  saveMany(
    workingHoursArr: WorkingHours[],
  ): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const rows = workingHoursArr.map((wh) =>
        this.persistenceMapperFactory.workingHoursPersistenceMapper.toPersistence(
          wh,
        ),
      )
      yield* Effect.all(
        rows.map((row) =>
          dbEffect(
            db
              .insert(workingHoursTable)
              .values(row)
              .onConflictDoUpdate({ target: workingHoursTable.id, set: row }),
          ),
        ),
      )
    })
  }

  delete(id: WorkingHoursId): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      yield* dbEffect(
        db.delete(workingHoursTable).where(eq(workingHoursTable.id, id)),
      )
    })
  }
}
