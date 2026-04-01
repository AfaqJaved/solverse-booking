import { Effect, Option } from 'effect';
import { UserId, User } from 'entry';
import { DatabaseFailure } from '../../../errors/entry';

export const IUserRepository = Symbol('IUserRepository');

export interface UserRepository {
  findById(id: UserId): Effect.Effect<Option.Option<User>, DatabaseFailure>;
  findByEmail(
    email: string,
  ): Effect.Effect<Option.Option<User>, DatabaseFailure>;
  save(user: User): Effect.Effect<void, DatabaseFailure>;
  delete(id: UserId): Effect.Effect<void, DatabaseFailure>;
}