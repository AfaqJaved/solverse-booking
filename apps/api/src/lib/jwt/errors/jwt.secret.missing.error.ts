import { Data } from 'effect'

export class JwtSecretMissingError extends Data.TaggedError(
  'JwtSecretMissingError',
)<{
  message: string
  cause: unknown
}> {
  readonly sendToFrontend = false
}
