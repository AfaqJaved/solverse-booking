import { Effect, Option } from 'effect'
import { eq, and, count, sql } from 'drizzle-orm'
import {
  Service,
  ServiceId,
  ServiceRepository,
  DatabaseFailure,
  ServiceStatus,
  ServiceName,
} from '@solverse/domain'
import { BusinessId } from '@solverse/domain'
import { PersistenceMapperFactory } from '../mappers/persistence.mapper.factory'
import { servicesTable } from '../schema/service.table'
import { dbEffect, db } from '../connection/entry'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ServiceRepositoryImpl implements ServiceRepository {
  constructor(
    private readonly persistenceMapperFactory: PersistenceMapperFactory,
  ) {}

  findById(
    id: ServiceId,
  ): Effect.Effect<Option.Option<Service>, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const [row] = yield* dbEffect(
        db
          .select()
          .from(servicesTable)
          .where(eq(servicesTable.id, id))
          .limit(1),
      )
      if (!row) return Option.none()
      const service =
        yield* this.persistenceMapperFactory.servicePersistenceMapper.toDomain(
          row,
        )
      return Option.some(service)
    })
  }

  findByBusinessId(
    businessId: BusinessId,
    options?: {
      status?: ServiceStatus
      includeDeleted?: boolean
    }
  ): Effect.Effect<Service[], DatabaseFailure> {
    return Effect.gen(this, function* () {
      const conditions = [eq(servicesTable.businessId, businessId)]
      
      if (options?.status) {
        conditions.push(eq(servicesTable.status, options.status))
      }
      
      if (options?.includeDeleted !== true) {
        conditions.push(eq(servicesTable.isDeleted, false))
      }
      
      const rows = yield* dbEffect(
        db
          .select()
          .from(servicesTable)
          .where(and(...conditions)),
      )
      return yield* Effect.all(
        rows.map((row) =>
          this.persistenceMapperFactory.servicePersistenceMapper.toDomain(row),
        ),
      )
    })
  }

  save(service: Service): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const row =
        this.persistenceMapperFactory.servicePersistenceMapper.toPersistence(
          service,
        )
      yield* dbEffect(
        db
          .insert(servicesTable)
          .values(row)
          .onConflictDoUpdate({ target: servicesTable.id, set: row }),
      )
    })
  }

  countByBusinessId(
    businessId: BusinessId,
    options?: {
      status?: ServiceStatus
      includeDeleted?: boolean
    }
  ): Effect.Effect<number, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const conditions = [eq(servicesTable.businessId, businessId)]
      
      if (options?.status) {
        conditions.push(eq(servicesTable.status, options.status))
      }
      
      if (options?.includeDeleted !== true) {
        conditions.push(eq(servicesTable.isDeleted, false))
      }
      
      const result = yield* dbEffect(
        db
          .select({ count: count() })
          .from(servicesTable)
          .where(and(...conditions)),
      )
      
      const row = result[0]
      if (!row) {
        return 0
      }
      
      return row.count
    })
  }

  nameExistsForBusiness(
    businessId: BusinessId,
    name: ServiceName,
    excludeServiceId?: ServiceId
  ): Effect.Effect<boolean, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const conditions = [
        eq(servicesTable.businessId, businessId),
        eq(servicesTable.name, name),
        eq(servicesTable.isDeleted, false),
      ]
      
      if (excludeServiceId) {
        conditions.push(sql`${servicesTable.id} != ${excludeServiceId}`)
      }
      
      const result = yield* dbEffect(
        db
          .select({ exists: sql<boolean>`EXISTS (
            SELECT 1 FROM ${servicesTable}
            WHERE ${and(...conditions)}
            LIMIT 1
          )` })
          .from(servicesTable)
          .limit(1),
      )
      
      const row = result[0]
      if (!row) {
        return false
      }
      
      return row.exists
    })
  }

  delete(id: ServiceId): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      yield* dbEffect(db.delete(servicesTable).where(eq(servicesTable.id, id)))
    })
  }
}
