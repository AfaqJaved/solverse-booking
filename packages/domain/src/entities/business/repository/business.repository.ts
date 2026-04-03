import { Effect, Option } from 'effect'
import { UserId } from '../../user/entry'
import { DatabaseFailure } from '../../../errors/entry'
import { Business } from '../business.aggregate'
import { BusinessId, BusinessSlug } from '../entry'

export const IBusinessRepository = Symbol('IBusinessRepository')

export interface BusinessRepository {
  findById(
    id: BusinessId,
  ): Effect.Effect<Option.Option<Business>, DatabaseFailure>
  findBySlug(
    slug: BusinessSlug,
  ): Effect.Effect<Option.Option<Business>, DatabaseFailure>
  findByOwnerId(ownerId: UserId): Effect.Effect<Business[], DatabaseFailure>
  slugExists(slug: BusinessSlug): Effect.Effect<boolean, DatabaseFailure>
  save(business: Business): Effect.Effect<void, DatabaseFailure>
  delete(id: BusinessId): Effect.Effect<void, DatabaseFailure>
}
