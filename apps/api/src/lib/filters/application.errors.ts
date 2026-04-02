import {
  PersistenceMappingError,
  DatabaseQueryError,
  DatabaseTransactionRollbackError,
  DatabaseError,
  EmailAlreadyTakenError,
  EmailNotVerifiedError,
  InvalidUserTransitionError,
  UserAlreadyActiveError,
  UserInactiveError,
  UserInvalidCredentialsError,
  UserNotFoundError,
  UserSuspendedError,
} from '@solverse/domain'
import {
  JwtExpiredError,
  JwtMalformedError,
  JwtVerifyError,
  JwtSignError,
  JwtSecretMissingError,
} from '../jwt/entry'

export type ApplicationError = { sendToFrontEnd: boolean } & (
  | UserNotFoundError
  | EmailAlreadyTakenError
  | UserAlreadyActiveError
  | UserSuspendedError
  | UserInactiveError
  | UserInvalidCredentialsError
  | EmailNotVerifiedError
  | InvalidUserTransitionError
  | PersistenceMappingError
  | DatabaseQueryError
  | DatabaseTransactionRollbackError
  | DatabaseError
  | JwtExpiredError
  | JwtMalformedError
  | JwtVerifyError
  | JwtSignError
  | JwtSecretMissingError
)
