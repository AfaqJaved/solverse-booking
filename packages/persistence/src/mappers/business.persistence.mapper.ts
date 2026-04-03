import { Effect } from 'effect'
import { Business } from '@solverse/domain'
import type { BusinessRow, BusinessInsertRow } from '../schema/business.table'
import { PersistenceMappingError } from '@solverse/domain'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BusinessPersistenceMapper {
  /**
   * Maps a raw database row to a validated Business domain aggregate.
   * Fails with PersistenceMappingError if the row data doesn't satisfy domain invariants.
   */
  toDomain(
    row: BusinessRow,
  ): Effect.Effect<Business, PersistenceMappingError, never> {
    return Business.fromRaw({
      id: row.id,
      ownerId: row.ownerId,
      name: row.name,
      slug: row.slug,
      email: row.email,
      phone: row.phone ?? null,
      timezone: row.timezone,
      status: row.status,
      plan: row.plan,
      currency: row.currency,
      logoUrl: row.logoUrl ?? null,
      description: row.description ?? null,
      website: row.website ?? null,
      suspendedReason: row.suspendedReason ?? null,
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
              'Failed to map Business (Persistence -> Domain aggregate )',
            cause,
          }),
      ),
    )
  }

  /**
   * Maps a Business domain aggregate to a database insert/update row.
   * Always succeeds — domain data is guaranteed valid by the aggregate invariants.
   */
  toPersistence(business: Business): BusinessInsertRow {
    const data = business.toRaw()
    return {
      id: data.id,
      ownerId: data.ownerId,
      name: data.name,
      slug: data.slug,
      email: data.email,
      phone: data.phone ?? null,
      timezone: data.timezone,
      status: data.status,
      plan: data.plan,
      currency: data.currency,
      logoUrl: data.logoUrl ?? null,
      description: data.description ?? null,
      website: data.website ?? null,
      suspendedReason: data.suspendedReason ?? null,
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
