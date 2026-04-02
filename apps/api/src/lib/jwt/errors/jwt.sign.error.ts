import { Data } from 'effect'

export class JwtSignError extends Data.TaggedError('JwtSignError')<{
  message: string
  cause: unknown
}> {
  readonly sendToFrontend = false
}
