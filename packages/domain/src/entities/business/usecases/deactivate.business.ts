import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  BusinessNotFoundError,
  InvalidBusinessTransitionError,
} from '../errors/entry'

export const IDeactivateBusinessUsecase = Symbol('IDeactivateBusinessUsecase')

export interface DeactivateBusinessUsecase {
  execute(params: {
    businessId: string
    actorId: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | BusinessNotFoundError
    | InvalidBusinessTransitionError
    | DatabaseFailure
  >
}
