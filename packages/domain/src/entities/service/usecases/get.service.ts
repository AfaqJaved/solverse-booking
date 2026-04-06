import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { ServiceNotFoundError } from '../errors/entry'
import { Service } from '../service.aggregate'

export const IGetServiceUsecase = Symbol('IGetServiceUsecase')

export interface GetServiceUsecase {
  execute(params: {
    serviceId: string
  }): Effect.Effect<Service, InvalidInputError | ServiceNotFoundError | DatabaseFailure>
}