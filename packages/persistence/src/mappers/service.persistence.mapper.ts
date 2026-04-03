import { Effect } from 'effect'
import { Service } from '@solverse/domain'
import type { ServiceRow, ServiceInsertRow } from '../schema/service.table'
import { PersistenceMappingError } from '@solverse/domain'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ServicePersistenceMapper {
  /**
   * Maps a raw database row to a validated Service domain aggregate.
   * Fails with PersistenceMappingError if the row data doesn't satisfy domain invariants.
   */
  toDomain(
    row: ServiceRow,
  ): Effect.Effect<Service, PersistenceMappingError, never> {
    return Service.fromRaw({
      id: row.id,
      businessId: row.businessId,
      name: row.name,
      description: row.description ?? null,
      duration: row.duration,
      bufferTime: row.bufferTime,
      price: row.price,
      status: row.status,
      color: row.color ?? null,
      maxBookingsPerSlot: row.maxBookingsPerSlot,
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
            message: 'Failed to map Service (Persistence -> Domain aggregate)',
            cause,
          }),
      ),
    )
  }

  /**
   * Maps a Service domain aggregate to a database insert/update row.
   * Always succeeds — domain data is guaranteed valid by the aggregate invariants.
   */
  toPersistence(service: Service): ServiceInsertRow {
    const data = service.toRaw()
    return {
      id: data.id,
      businessId: data.businessId,
      name: data.name,
      description: data.description ?? null,
      duration: data.duration,
      bufferTime: data.bufferTime,
      price: data.price,
      status: data.status,
      color: data.color ?? null,
      maxBookingsPerSlot: data.maxBookingsPerSlot,
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
