import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { ServiceNotFoundError, ServiceDeletedError } from '../errors/entry'

export const IActivateServiceUsecase = Symbol('IActivateServiceUsecase')

export interface ActivateServiceUsecase {
  execute(params: {
    serviceId: string
    updatedBy: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | ServiceNotFoundError
    | ServiceDeletedError
    | DatabaseFailure
  >
}
