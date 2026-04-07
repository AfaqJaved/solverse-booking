import { Effect } from 'effect'
import { TimeOff } from '@solverse/domain'
import type { TimeOffRow, TimeOffInsertRow } from '../schema/timeoff.table'
import { PersistenceMappingError } from '@solverse/domain'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TimeOffPersistenceMapper {
  /**
   * Maps a raw database row to a validated TimeOff domain aggregate.
   * Fails with PersistenceMappingError if the row data doesn't satisfy domain invariants.
   */
  toDomain(
    row: TimeOffRow,
  ): Effect.Effect<TimeOff, PersistenceMappingError, never> {
    return TimeOff.fromRaw({
      id: row.id,
      businessId: row.businessId,
      label: row.label,
      allDay: row.allDay,
      cadence: row.cadence,
      status: row.status,
      startDate: new Date(row.startDate),
      endDate: new Date(row.endDate),
      startTime: row.startTime ?? null,
      endTime: row.endTime ?? null,
      createdAt: row.createdAt,
      createdBy: row.createdBy ?? null,
      updatedAt: row.updatedAt,
      updatedBy: row.updatedBy ?? null,
      deletedAt: row.deletedAt ?? null,
      deletedBy: row.deletedBy ?? null,
      isDeleted: row.isDeleted,
    }).pipe(
      Effect.mapError(
        (cause) =>
          new PersistenceMappingError({
            message: 'Failed to map TimeOff (Persistence -> Domain aggregate)',
            cause,
          }),
      ),
    )
  }

  /**
   * Maps a TimeOff domain aggregate to a database insert row.
   * Used when creating or updating records in the database.
   */
  toPersistence(timeOff: TimeOff): TimeOffInsertRow {
    const data = timeOff.toJSON()
    return {
      id: data.id,
      businessId: data.businessId,
      label: data.label,
      allDay: data.allDay,
      cadence: data.cadence,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime ?? null,
      endTime: data.endTime ?? null,
      createdAt: data.createdAt,
      createdBy: data.createdBy ?? null,
      updatedAt: data.updatedAt,
      updatedBy: data.updatedBy ?? null,
      deletedAt: data.deletedAt ?? null,
      deletedBy: data.deletedBy ?? null,
      isDeleted: data.isDeleted,
    }
  }
}
