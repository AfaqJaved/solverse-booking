import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { TimeOffError } from '../errors/entry'

export const IDeleteTimeOffUsecase = Symbol('IDeleteTimeOffUsecase')

export interface DeleteTimeOffUsecase {
  execute(params: {
    id: string
    businessId: string
    actorId: string | null
  }): Effect.Effect<void, InvalidInputError | TimeOffError | DatabaseFailure>
}
