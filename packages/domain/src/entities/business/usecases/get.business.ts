import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { BusinessNotFoundError } from '../errors/entry'
import { Business } from '../business.aggregate'

export const IGetBusinessUsecase = Symbol('IGetBusinessUsecase')

export interface GetBusinessUsecase {
  execute(params: {
    businessId: string
  }): Effect.Effect<Business, InvalidInputError | BusinessNotFoundError | DatabaseFailure>
}
