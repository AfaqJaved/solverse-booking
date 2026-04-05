import { Effect, ParseResult, Schema } from 'effect'
import { InvalidInputError } from '@solverse/domain'
import { ArrayFormatterIssue, ParseError } from 'effect/ParseResult'

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
      Effect.catchTag('ParseError', (e: ParseError) => {
        console.log('ParseError:', e)
        const message = ParseResult.ArrayFormatter.formatErrorSync(e)
          .map((issue: ArrayFormatterIssue) => {
            return issue.message
          })
          .join('; ')
        return Effect.fail(new InvalidInputError({ message, cause: message }))
      }),
    )
