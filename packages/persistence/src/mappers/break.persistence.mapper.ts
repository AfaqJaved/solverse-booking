import { Effect } from 'effect'
import { Break, PersistenceMappingError } from '@solverse/domain'
import type { BreakRow, BreakInsertRow } from '../schema/break.table'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BreakPersistenceMapper {
  toDomain(
    row: BreakRow,
  ): Effect.Effect<Break, PersistenceMappingError, never> {
    return Break.fromRaw({
      id: row.id,
      workingHoursId: row.workingHoursId,
      startTime: row.startTime,
      endTime: row.endTime,
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
            message: 'Failed to map Break (Persistence -> Domain aggregate)',
            cause,
          }),
      ),
    )
  }

  toPersistence(breakEntity: Break): BreakInsertRow {
    const data = breakEntity.toRaw()
    return {
      id: data.id,
      workingHoursId: data.workingHoursId,
      startTime: data.startTime,
      endTime: data.endTime,
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
