import { Effect, Schema } from 'effect'
import { InvalidInputError } from '@solverse/domain'

/**
 * Decodes a value through an Effect Schema, converting any ParseError
 * into a typed InvalidInputError domain error.
 *
 * Use this inside usecases to validate and brand primitive inputs.
 */
export const decodeOrFail =
  <A, I>(schema: Schema.Schema<A, I>) =>
  (input: I): Effect.Effect<A, InvalidInputError> =>
    Schema.decode(schema)(input).pipe(
      Effect.catchTag('ParseError', (e) =>
        Effect.fail(
          new InvalidInputError({ message: e.message, cause: e.message }),
        ),
      ),
    )
