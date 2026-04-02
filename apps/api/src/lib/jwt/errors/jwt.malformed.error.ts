import { Data } from 'effect'

export class JwtMalformedError extends Data.TaggedError('JwtMalformedError')<{
  message: string
  cause: unknown
}> {
  readonly sendToFrontend = true
}
