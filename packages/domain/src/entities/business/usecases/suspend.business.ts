import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  BusinessDeletedError,
  BusinessNotFoundError,
  InvalidBusinessTransitionError,
} from '../errors/entry'

export const ISuspendBusinessUsecase = Symbol('ISuspendBusinessUsecase')

export interface SuspendBusinessUsecase {
  execute(params: {
    businessId: string
    reason: string
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
