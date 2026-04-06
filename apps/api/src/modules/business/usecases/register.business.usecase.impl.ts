import { Injectable } from '@nestjs/common'
import {
  Business,
  BusinessCurrency,
  BusinessEmail,
  BusinessId,
  BusinessName,
  BusinessPhoneNumber,
  BusinessPlan,
  BusinessSlug,
  BusinessSlugTakenError,
  BusinessTimezone,
  DatabaseFailure,
  InvalidInputError,
  RegisterBusinessUsecase,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class RegisterBusinessUsecaseImpl implements RegisterBusinessUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    ownerId,
    name,
    slug,
    email,
    timezone,
    currency,
    phone,
    plan,
  }: {
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
  > {
    return Effect.gen(this, function* () {
      const id = yield* decodeOrFail(BusinessId)(crypto.randomUUID())
      const decodedOwnerId = yield* decodeOrFail(UserId)(ownerId)
      const decodedName = yield* decodeOrFail(BusinessName)(name)
      const decodedSlug = yield* decodeOrFail(BusinessSlug)(slug)
      const decodedEmail = yield* decodeOrFail(BusinessEmail)(email)
      const decodedTimezone = yield* decodeOrFail(BusinessTimezone)(timezone)
      const decodedCurrency = yield* decodeOrFail(BusinessCurrency)(currency)
      const decodedPhone =
        phone != null ? yield* decodeOrFail(BusinessPhoneNumber)(phone) : undefined
      const decodedPlan =
        plan != null ? yield* decodeOrFail(BusinessPlan)(plan) : undefined

      const slugTaken =
        yield* this.repositoryFactory.businessRepository.slugExists(decodedSlug)

      if (slugTaken) {
        return yield* Effect.fail(
          new BusinessSlugTakenError({
            message: `Slug "${decodedSlug}" is already taken`,
            cause: `Slug "${decodedSlug}" is already taken`,
          }),
        )
      }

      const business = Business.create({
        id,
        ownerId: decodedOwnerId,
        name: decodedName,
        slug: decodedSlug,
        email: decodedEmail,
        timezone: decodedTimezone,
        currency: decodedCurrency,
        phone: decodedPhone,
        plan: decodedPlan,
      })

      yield* this.repositoryFactory.businessRepository.save(business)

      return { id: business.id }
    })
  }
}
