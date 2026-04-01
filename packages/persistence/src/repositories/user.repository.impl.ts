import { Effect, Option } from 'effect';
import { eq } from 'drizzle-orm';
import { User, UserRepository, UserId, DatabaseFailure } from '@solverse/domain';
import { PersistenceMapperFactory } from '../mappers/persistence.mapper.factory';
import { usersTable } from '../schema/user.table';
import { dbEffect, db } from '../connection/entry';
import { Injectable } from '@nestjs/common';


@Injectable()
export class UserRepositoryImpl implements UserRepository {

  constructor(private readonly persistenceMapperFactory: PersistenceMapperFactory) { }


  findById(
    id: UserId,
  ): Effect.Effect<Option.Option<User>, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const [row] = yield* dbEffect(
        db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1),
      );
      if (!row) return Option.none();
      const user = yield* this.persistenceMapperFactory.userPersistenceMapper.toDomain(row);
      return Option.some(user);
    });
  }

  findByEmail(
    email: string,
  ): Effect.Effect<Option.Option<User>, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const [row] = yield* dbEffect(
        db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1),
      );
      if (!row) return Option.none();
      const user = yield* this.persistenceMapperFactory.userPersistenceMapper.toDomain(row);
      return Option.some(user);
    });
  }

  save(user: User): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const row = this.persistenceMapperFactory.userPersistenceMapper.toPersistence(user);
      yield* dbEffect(
        db
          .insert(usersTable)
          .values(row)
          .onConflictDoUpdate({ target: usersTable.id, set: row }),
      );
    });
  }

  delete(id: UserId): Effect.Effect<void, DatabaseFailure> {
    return Effect.gen(this, function* () {
      yield* dbEffect(db.delete(usersTable).where(eq(usersTable.id, id)));
    });
  }
}
