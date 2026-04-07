import { Injectable } from '@nestjs/common'
import {
  BusinessCurrency,
  BusinessDeletedError,
  BusinessEmail,
  BusinessId,
  BusinessName,
  BusinessNotFoundError,
  BusinessPhoneNumber,
  BusinessTimezone,
  DatabaseFailure,
  InvalidInputError,
  UpdateBusinessProfileUsecase,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class UpdateBusinessProfileUsecaseImpl implements UpdateBusinessProfileUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    businessId,
    actorId,
    name,
    description,
    website,
    logoUrl,
    phone,
    timezone,
    email,
    currency,
  }: {
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
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(BusinessId)(businessId)
      const decodedActorId = yield* decodeOrFail(UserId)(actorId)
      const decodedName =
        name != null ? yield* decodeOrFail(BusinessName)(name) : undefined
      const decodedEmail =
        email != null ? yield* decodeOrFail(BusinessEmail)(email) : undefined
      const decodedTimezone =
        timezone != null
          ? yield* decodeOrFail(BusinessTimezone)(timezone)
          : undefined
      const decodedCurrency =
        currency != null
          ? yield* decodeOrFail(BusinessCurrency)(currency)
          : undefined
      const decodedPhone =
        phone != null ? yield* decodeOrFail(BusinessPhoneNumber)(phone) : phone

      const maybeBusiness =
        yield* this.repositoryFactory.businessRepository.findById(decodedId)

      if (Option.isNone(maybeBusiness)) {
        return yield* Effect.fail(
          new BusinessNotFoundError({
            message: `Business not found: ${decodedId}`,
            cause: `Business not found: ${decodedId}`,
          }),
        )
      }

      const updated = yield* maybeBusiness.value.updateProfile(
        {
          ...(decodedName !== undefined && { name: decodedName }),
          ...(description !== undefined && { description }),
          ...(website !== undefined && { website }),
          ...(logoUrl !== undefined && { logoUrl }),
          ...(decodedPhone !== undefined && { phone: decodedPhone }),
          ...(decodedTimezone !== undefined && { timezone: decodedTimezone }),
          ...(decodedEmail !== undefined && { email: decodedEmail }),
          ...(decodedCurrency !== undefined && { currency: decodedCurrency }),
        },
        decodedActorId,
      )

      yield* this.repositoryFactory.businessRepository.save(updated)
    })
  }
}
