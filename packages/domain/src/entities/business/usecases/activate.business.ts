import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  BusinessAlreadyActiveError,
  BusinessNotFoundError,
  InvalidBusinessTransitionError,
} from '../errors/entry'

export const IActivateBusinessUsecase = Symbol('IActivateBusinessUsecase')

export interface ActivateBusinessUsecase {
  execute(params: {
    businessId: string
    actorId: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | BusinessNotFoundError
    | BusinessAlreadyActiveError
    | InvalidBusinessTransitionError
    | DatabaseFailure
  >
}
