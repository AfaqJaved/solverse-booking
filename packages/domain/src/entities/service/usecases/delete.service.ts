import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { ServiceNotFoundError, ServiceDeletedError } from '../errors/entry'

export const IDeleteServiceUsecase = Symbol('IDeleteServiceUsecase')

export interface DeleteServiceUsecase {
  execute(params: {
    serviceId: string
    deletedBy: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | ServiceNotFoundError
    | ServiceDeletedError
    | DatabaseFailure
  >
}
