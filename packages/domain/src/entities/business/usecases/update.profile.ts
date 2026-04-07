import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { BusinessDeletedError, BusinessNotFoundError } from '../errors/entry'

export const IUpdateBusinessProfileUsecase = Symbol(
  'IUpdateBusinessProfileUsecase',
)

export interface UpdateBusinessProfileUsecase {
  execute(params: {
    businessId: string
    actorId: string
    name?: string
    description?: string | null
    website?: string | null
    logoUrl?: string | null
    phone?: string | null
    timezone?: string
    email?: string
    currency?: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | BusinessNotFoundError
    | BusinessDeletedError
    | DatabaseFailure
  >
}
