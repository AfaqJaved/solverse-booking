import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  BusinessDeletedError,
  BusinessNotFoundError,
  BusinessSlugTakenError,
} from '../errors/entry'

export const IUpdateBusinessSlugUsecase = Symbol('IUpdateBusinessSlugUsecase')

export interface UpdateBusinessSlugUsecase {
  execute(params: {
    businessId: string
    slug: string
    actorId: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | BusinessNotFoundError
    | BusinessSlugTakenError
    | BusinessDeletedError
    | DatabaseFailure
  >
}
