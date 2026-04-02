import * as bcrypt from 'bcrypt'
import { Effect } from 'effect'
import { HashError } from './errors/hash.error'

const SALT_ROUNDS = 12

export class HashUtils {
  static hash(plain: string): Effect.Effect<string, HashError> {
    return Effect.tryPromise({
      try: () => bcrypt.hash(plain, SALT_ROUNDS),
      catch: (cause) =>
        new HashError({ message: 'Failed to hash password', cause }),
    })
  }

  static verify(plain: string, hashed: string): Effect.Effect<boolean, HashError> {
    return Effect.tryPromise({
      try: () => bcrypt.compare(plain, hashed),
      catch: (cause) =>
        new HashError({ message: 'Failed to verify password', cause }),
    })
  }
}
