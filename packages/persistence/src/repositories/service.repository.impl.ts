import { Effect, Option } from 'effect'
import { eq } from 'drizzle-orm'
import {
  Service,
  ServiceId,
  ServiceRepository,
  DatabaseFailure,
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
  ): Effect.Effect<Service[], DatabaseFailure> {
    return Effect.gen(this, function* () {
      const rows = yield* dbEffect(
        db
          .select()
          .from(servicesTable)
          .where(eq(servicesTable.businessId, businessId)),
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

  delete(id: ServiceId): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      yield* dbEffect(db.delete(servicesTable).where(eq(servicesTable.id, id)))
    })
  }
}
