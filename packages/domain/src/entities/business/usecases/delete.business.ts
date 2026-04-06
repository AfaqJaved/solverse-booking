import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { BusinessDeletedError, BusinessNotFoundError } from '../errors/entry'

export const IDeleteBusinessUsecase = Symbol('IDeleteBusinessUsecase')

export interface DeleteBusinessUsecase {
  execute(params: {
    businessId: string
    actorId: string
  }): Effect.Effect<
    void,
    InvalidInputError | BusinessNotFoundError | BusinessDeletedError | DatabaseFailure
  >
}
