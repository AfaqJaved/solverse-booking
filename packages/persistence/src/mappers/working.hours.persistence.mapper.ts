import { Effect } from 'effect'
import { WorkingHours } from '@solverse/domain'
import type {
  WorkingHoursRow,
  WorkingHoursInsertRow,
} from '../schema/working.hours.table'
import { PersistenceMappingError } from '@solverse/domain'
import { Injectable } from '@nestjs/common'

@Injectable()
export class WorkingHoursPersistenceMapper {
  /**
   * Maps a raw database row to a validated WorkingHours domain aggregate.
   * Fails with PersistenceMappingError if the row data doesn't satisfy domain invariants.
   */
  toDomain(
    row: WorkingHoursRow,
  ): Effect.Effect<WorkingHours, PersistenceMappingError, never> {
    return WorkingHours.fromRaw({
      id: row.id,
      businessId: row.businessId,
      dayOfWeek: row.dayOfWeek,
      isOpen: row.isOpen,
      openTime: row.openTime ?? null,
      closeTime: row.closeTime ?? null,
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
            message:
              'Failed to map WorkingHours (Persistence -> Domain aggregate)',
            cause,
          }),
      ),
    )
  }

  /**
   * Maps a WorkingHours domain aggregate to a database insert/update row.
   * Always succeeds — domain data is guaranteed valid by the aggregate invariants.
   */
  toPersistence(workingHours: WorkingHours): WorkingHoursInsertRow {
    const data = workingHours.toRaw()
    return {
      id: data.id,
      businessId: data.businessId,
      dayOfWeek: data.dayOfWeek,
      isOpen: data.isOpen,
      openTime: data.openTime ?? null,
      closeTime: data.closeTime ?? null,
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
