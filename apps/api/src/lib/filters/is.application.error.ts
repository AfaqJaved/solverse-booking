import {
  InvalidInputError,
  UserNotFoundError,
  EmailAlreadyTakenError,
  UserAlreadyActiveError,
  UserSuspendedError,
  UserInactiveError,
  UserInvalidCredentialsError,
  EmailNotVerifiedError,
  InvalidUserTransitionError,
  PersistenceMappingError,
  DatabaseQueryError,
  DatabaseTransactionRollbackError,
  DatabaseError,
} from '@solverse/domain'
import {
  JwtExpiredError,
  JwtMalformedError,
  JwtVerifyError,
  JwtSignError,
  JwtSecretMissingError,
} from '../jwt/entry'
import { ApplicationError } from './application.errors'

export function isApplicationError(error: unknown): error is ApplicationError {
  return (
    error instanceof InvalidInputError ||
    error instanceof UserNotFoundError ||
    error instanceof EmailAlreadyTakenError ||
    error instanceof UserAlreadyActiveError ||
    error instanceof UserSuspendedError ||
    error instanceof UserInactiveError ||
    error instanceof UserInvalidCredentialsError ||
    error instanceof EmailNotVerifiedError ||
    error instanceof InvalidUserTransitionError ||
    error instanceof PersistenceMappingError ||
    error instanceof DatabaseQueryError ||
    error instanceof DatabaseTransactionRollbackError ||
    error instanceof DatabaseError ||
    error instanceof JwtExpiredError ||
    error instanceof JwtMalformedError ||
    error instanceof JwtVerifyError ||
    error instanceof JwtSignError ||
    error instanceof JwtSecretMissingError
  )
}
