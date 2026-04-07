import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { Business } from '../business.aggregate'

export const IGetBusinessesByOwnerUsecase = Symbol(
  'IGetBusinessesByOwnerUsecase',
)

export interface GetBusinessesByOwnerUsecase {
  execute(params: {
    ownerId: string
  }): Effect.Effect<Business[], InvalidInputError | DatabaseFailure>
}
