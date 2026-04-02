import { HttpStatus } from '@nestjs/common'
import {
  UserNotFoundError,
  EmailAlreadyTakenError,
  UserAlreadyActiveError,
  UserSuspendedError,
  UserInactiveError,
  UserInvalidCredentialsError,
  EmailNotVerifiedError,
} from '@solverse/domain'
import {
  JwtExpiredError,
  JwtMalformedError,
  JwtVerifyError,
} from '../jwt/entry'
import { ApplicationError } from './application.errors'

export function resolveHttpStatus(error: ApplicationError): HttpStatus {
  if (error instanceof UserNotFoundError) return HttpStatus.NOT_FOUND
  if (error instanceof EmailAlreadyTakenError) return HttpStatus.CONFLICT
  if (error instanceof UserAlreadyActiveError) return HttpStatus.CONFLICT
  if (error instanceof UserSuspendedError) return HttpStatus.FORBIDDEN
  if (error instanceof UserInactiveError) return HttpStatus.FORBIDDEN
  if (error instanceof UserInvalidCredentialsError)
    return HttpStatus.UNAUTHORIZED
  if (error instanceof EmailNotVerifiedError) return HttpStatus.FORBIDDEN
  if (error instanceof JwtExpiredError) return HttpStatus.UNAUTHORIZED
  if (error instanceof JwtMalformedError) return HttpStatus.UNAUTHORIZED
  if (error instanceof JwtVerifyError) return HttpStatus.UNAUTHORIZED
  return HttpStatus.INTERNAL_SERVER_ERROR
}
