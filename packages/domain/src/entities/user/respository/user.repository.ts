import { Effect, Option } from 'effect';
import { UserId, User, UserRepositoryError } from 'entry';

export const IUserRepository = Symbol('IUserRepository');

export interface UserRepository {
  findById(
    id: UserId,
  ): Effect.Effect<
    Option.Option<User>,
    UserRepositoryError
  >;
  findByEmail(
    email: string,
  ): Effect.Effect<
    Option.Option<User>,
    UserRepositoryError
  >;
  save(user: User): Effect.Effect<void, UserRepositoryError>;
  delete(id: UserId): Effect.Effect<void, UserRepositoryError>;
}
