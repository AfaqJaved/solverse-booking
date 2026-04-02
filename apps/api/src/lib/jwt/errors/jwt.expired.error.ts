import { Data } from 'effect'

export class JwtExpiredError extends Data.TaggedError('JwtExpiredError')<{
  message: string
  cause: unknown
}> {
  readonly sendToFrontend = true
}
