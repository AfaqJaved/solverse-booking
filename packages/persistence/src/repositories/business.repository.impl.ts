import { Effect, Option } from 'effect'
import { eq } from 'drizzle-orm'
import {
  Business,
  BusinessId,
  BusinessRepository,
  BusinessSlug,
  DatabaseFailure,
} from '@solverse/domain'
import { UserId } from '@solverse/domain'
import { PersistenceMapperFactory } from '../mappers/persistence.mapper.factory'
import { businessesTable } from '../schema/business.table'
import { dbEffect, db } from '../connection/entry'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BusinessRepositoryImpl implements BusinessRepository {
  constructor(
    private readonly persistenceMapperFactory: PersistenceMapperFactory,
  ) {}

  findById(
    id: BusinessId,
  ): Effect.Effect<Option.Option<Business>, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const [row] = yield* dbEffect(
        db
          .select()
          .from(businessesTable)
          .where(eq(businessesTable.id, id))
          .limit(1),
      )
      if (!row) return Option.none()
      const business =
        yield* this.persistenceMapperFactory.businessPersistenceMapper.toDomain(
          row,
        )
      return Option.some(business)
    })
  }

  findBySlug(
    slug: BusinessSlug,
  ): Effect.Effect<Option.Option<Business>, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const [row] = yield* dbEffect(
        db
          .select()
          .from(businessesTable)
          .where(eq(businessesTable.slug, slug))
          .limit(1),
      )
      if (!row) return Option.none()
      const business =
        yield* this.persistenceMapperFactory.businessPersistenceMapper.toDomain(
          row,
        )
      return Option.some(business)
    })
  }

  findByOwnerId(ownerId: UserId): Effect.Effect<Business[], DatabaseFailure> {
    return Effect.gen(this, function* () {
      const rows = yield* dbEffect(
        db
          .select()
          .from(businessesTable)
          .where(eq(businessesTable.ownerId, ownerId)),
      )
      return yield* Effect.all(
        rows.map((row) =>
          this.persistenceMapperFactory.businessPersistenceMapper.toDomain(row),
        ),
      )
    })
  }

  slugExists(slug: BusinessSlug): Effect.Effect<boolean, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const [row] = yield* dbEffect(
        db
          .select({ id: businessesTable.id })
          .from(businessesTable)
          .where(eq(businessesTable.slug, slug))
          .limit(1),
      )
      return row !== undefined
    })
  }

  save(business: Business): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const row =
        this.persistenceMapperFactory.businessPersistenceMapper.toPersistence(
          business,
        )
      yield* dbEffect(
        db
          .insert(businessesTable)
          .values(row)
          .onConflictDoUpdate({ target: businessesTable.id, set: row }),
      )
    })
  }

  delete(id: BusinessId): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      yield* dbEffect(
        db.delete(businessesTable).where(eq(businessesTable.id, id)),
      )
    })
  }
}
