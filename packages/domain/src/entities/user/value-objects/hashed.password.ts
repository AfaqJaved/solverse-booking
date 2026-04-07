import { Schema } from 'effect'

/**
 * Branded hashed password value object.
 *
 * Represents a bcrypt/argon2 hashed password string — never a plaintext password.
 * This value object must only be constructed from an already-hashed value.
 * Hashing itself is the responsibility of the application/infrastructure layer.
 *
 * Valid:   "$2b$12$...", "$argon2id$..."
 * Invalid: "mypassword123" (plaintext should never be stored)
 */
export const HashedPassword = Schema.String.pipe(
  Schema.minLength(1, {
    message: () =>
      '@Solverse/User: password must be a non-empty hashed password string (bcrypt/argon2)',
  }),
  Schema.brand('HashedPassword'),
)

export type HashedPassword = typeof HashedPassword.Type
