import { Data } from 'effect'

export class HashError extends Data.TaggedError('HashError')<{
  message: string
  cause: unknown
}> {}
