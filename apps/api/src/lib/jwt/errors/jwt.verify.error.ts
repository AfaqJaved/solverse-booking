import { Data } from 'effect'

export class JwtVerifyError extends Data.TaggedError('JwtVerifyError')<{
  message: string
  cause: unknown
}> {
  readonly sendToFrontend = true
}
