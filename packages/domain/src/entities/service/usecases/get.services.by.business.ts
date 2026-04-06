import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { Service } from '../service.aggregate'

export const IGetServicesByBusinessUsecase = Symbol('IGetServicesByBusinessUsecase')

export interface GetServicesByBusinessUsecase {
  execute(params: {
    businessId: string
  }): Effect.Effect<Service[], InvalidInputError | DatabaseFailure>
}