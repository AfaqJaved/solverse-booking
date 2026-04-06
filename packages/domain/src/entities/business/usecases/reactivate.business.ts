import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  BusinessDeletedError,
  BusinessNotFoundError,
  InvalidBusinessTransitionError,
} from '../errors/entry'

export const IReactivateBusinessUsecase = Symbol('IReactivateBusinessUsecase')

export interface ReactivateBusinessUsecase {
  execute(params: {
    businessId: string
    actorId: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | BusinessNotFoundError
    | InvalidBusinessTransitionError
    | BusinessDeletedError
    | DatabaseFailure
  >
}
