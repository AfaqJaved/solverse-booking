import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { ServiceNotFoundError, ServiceDeletedError } from '../errors/entry'

export const IDeactivateServiceUsecase = Symbol('IDeactivateServiceUsecase')

export interface DeactivateServiceUsecase {
  execute(params: {
    serviceId: string
    updatedBy: string
  }): Effect.Effect<
    void,
    InvalidInputError | ServiceNotFoundError | ServiceDeletedError | DatabaseFailure
  >
}