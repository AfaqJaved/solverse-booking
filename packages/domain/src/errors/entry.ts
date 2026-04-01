export * from './database.query.error';
export * from './database.transaction.rollback.error';
export * from './database.error';
export * from './persistence.mapping.error';

import { DatabaseQueryError } from './database.query.error';
import { DatabaseTransactionRollbackError } from './database.transaction.rollback.error';
import { DatabaseError } from './database.error';
import { PersistenceMappingError } from './persistence.mapping.error';

export type DatabaseFailure =
  | DatabaseQueryError
  | DatabaseTransactionRollbackError
  | DatabaseError
  | PersistenceMappingError;