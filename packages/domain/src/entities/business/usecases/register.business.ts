import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { BusinessSlugTakenError } from '../errors/entry'

export const IRegisterBusinessUsecase = Symbol('IRegisterBusinessUsecase')

export interface RegisterBusinessUsecase {
  execute(params: {
    ownerId: string
    name: string
    slug: string
    email: string
    timezone: string
    currency: string
    phone?: string
    plan?: string
  }): Effect.Effect<
    { id: string },
    InvalidInputError | BusinessSlugTakenError | DatabaseFailure
  >
}
