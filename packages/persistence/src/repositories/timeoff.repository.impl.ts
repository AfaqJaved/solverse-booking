import { Effect, Option } from 'effect'
import { and, eq, gte, lte, or, isNull, not, sql } from 'drizzle-orm'
import {
  TimeOff,
  TimeOffId,
  TimeOffRepository,
  BusinessId,
  DatabaseFailure,
} from '@solverse/domain'
import { PersistenceMapperFactory } from '../mappers/persistence.mapper.factory'
import { timeoffsTable } from '../schema/timeoff.table'
import { dbEffect, db } from '../connection/entry'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TimeOffRepositoryImpl implements TimeOffRepository {
  constructor(
    private readonly persistenceMapperFactory: PersistenceMapperFactory,
  ) {}

  findById(
    id: TimeOffId,
  ): Effect.Effect<Option.Option<TimeOff>, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const [row] = yield* dbEffect(
        db
          .select()
          .from(timeoffsTable)
          .where(
            and(eq(timeoffsTable.id, id), eq(timeoffsTable.isDeleted, false)),
          )
          .limit(1),
      )
      if (!row) return Option.none()
      const timeOff =
        yield* this.persistenceMapperFactory.timeOffPersistenceMapper.toDomain(
          row,
        )
      return Option.some(timeOff)
    })
  }

  findByBusinessId(
    businessId: BusinessId,
  ): Effect.Effect<TimeOff[], DatabaseFailure> {
    return Effect.gen(this, function* () {
      const rows = yield* dbEffect(
        db
          .select()
          .from(timeoffsTable)
          .where(
            and(
              eq(timeoffsTable.businessId, businessId),
              eq(timeoffsTable.isDeleted, false),
            ),
          )
          .orderBy(timeoffsTable.startDate, timeoffsTable.startTime),
      )
      return yield* Effect.all(
        rows.map((row) =>
          this.persistenceMapperFactory.timeOffPersistenceMapper.toDomain(row),
        ),
      )
    })
  }

  findActiveByBusinessIdAndDateRange(
    businessId: BusinessId,
    startDate: Date,
    endDate: Date,
  ): Effect.Effect<TimeOff[], DatabaseFailure> {
    return Effect.gen(this, function* () {
      const rows = yield* dbEffect(
        db
          .select()
          .from(timeoffsTable)
          .where(
            and(
              eq(timeoffsTable.businessId, businessId),
              eq(timeoffsTable.status, 'active'),
              eq(timeoffsTable.isDeleted, false),
              // Time off overlaps with the query date range
              or(
                // Time off starts within the query range
                and(
                  gte(timeoffsTable.startDate, sql`${startDate}`),
                  lte(timeoffsTable.startDate, sql`${endDate}`),
                ),
                // Time off ends within the query range
                and(
                  gte(timeoffsTable.endDate, sql`${startDate}`),
                  lte(timeoffsTable.endDate, sql`${endDate}`),
                ),
                // Time off completely contains the query range
                and(
                  lte(timeoffsTable.startDate, sql`${startDate}`),
                  gte(timeoffsTable.endDate, sql`${endDate}`),
                ),
              ),
            ),
          )
          .orderBy(timeoffsTable.startDate, timeoffsTable.startTime),
      )
      return yield* Effect.all(
        rows.map((row) =>
          this.persistenceMapperFactory.timeOffPersistenceMapper.toDomain(row),
        ),
      )
    })
  }

  hasOverlappingTimeOff(
    businessId: BusinessId,
    startDate: Date,
    endDate: Date,
    startTime: string | null,
    endTime: string | null,
    excludeId?: TimeOffId,
  ): Effect.Effect<boolean, DatabaseFailure> {
    return Effect.gen(this, function* () {
      // Build conditions for date overlap
      const dateOverlapConditions = or(
        // New time off starts within existing time off
        and(
          gte(sql`${startDate}`, timeoffsTable.startDate),
          lte(sql`${startDate}`, timeoffsTable.endDate),
        ),
        // New time off ends within existing time off
        and(
          gte(sql`${endDate}`, timeoffsTable.startDate),
          lte(sql`${endDate}`, timeoffsTable.endDate),
        ),
        // New time off completely contains existing time off
        and(
          lte(sql`${startDate}`, timeoffsTable.startDate),
          gte(sql`${endDate}`, timeoffsTable.endDate),
        ),
      )

      // Build conditions for time overlap
      let timeOverlapConditions: ReturnType<typeof sql>

      if (startTime !== null && endTime !== null) {
        // New time off has specific times
        timeOverlapConditions = or(
          // Existing time off is all-day (covers the entire day)
          and(isNull(timeoffsTable.startTime), isNull(timeoffsTable.endTime)),
          // Both have specific times and they overlap
          and(
            not(isNull(timeoffsTable.startTime)),
            not(isNull(timeoffsTable.endTime)),
            or(
              // New time starts within existing time range
              and(
                sql`${startTime} >= ${timeoffsTable.startTime}`,
                sql`${startTime} < ${timeoffsTable.endTime}`,
              ),
              // New time ends within existing time range
              and(
                sql`${endTime} > ${timeoffsTable.startTime}`,
                sql`${endTime} <= ${timeoffsTable.endTime}`,
              ),
              // New time completely contains existing time range
              and(
                sql`${startTime} <= ${timeoffsTable.startTime}`,
                sql`${endTime} >= ${timeoffsTable.endTime}`,
              ),
            ),
          ),
        )!
      } else {
        // New time off is all-day
        timeOverlapConditions = sql`true` // All-day time off overlaps with any time off
      }

      const conditions = [
        eq(timeoffsTable.businessId, businessId),
        eq(timeoffsTable.status, 'active'),
        eq(timeoffsTable.isDeleted, false),
        dateOverlapConditions,
        timeOverlapConditions,
      ]

      // Exclude the current time off when updating
      if (excludeId) {
        conditions.push(not(eq(timeoffsTable.id, excludeId)))
      }

      const [row] = yield* dbEffect(
        db
          .select({ id: timeoffsTable.id })
          .from(timeoffsTable)
          .where(and(...conditions))
          .limit(1),
      )
      return row !== undefined
    })
  }

  save(timeOff: TimeOff): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const row =
        this.persistenceMapperFactory.timeOffPersistenceMapper.toPersistence(
          timeOff,
        )
      yield* dbEffect(
        db
          .insert(timeoffsTable)
          .values(row)
          .onConflictDoUpdate({
            target: timeoffsTable.id,
            set: {
              label: row.label,
              allDay: row.allDay,
              cadence: row.cadence,
              status: row.status,
              startDate: row.startDate,
              endDate: row.endDate,
              startTime: row.startTime,
              endTime: row.endTime,
              updatedAt: row.updatedAt,
              updatedBy: row.updatedBy,
              deletedAt: row.deletedAt,
              deletedBy: row.deletedBy,
              isDeleted: row.isDeleted,
            },
          }),
      )
    })
  }

  delete(id: TimeOffId): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      yield* dbEffect(
        db
          .update(timeoffsTable)
          .set({
            isDeleted: true,
            deletedAt: new Date(),
          })
          .where(eq(timeoffsTable.id, id)),
      )
    })
  }
}
