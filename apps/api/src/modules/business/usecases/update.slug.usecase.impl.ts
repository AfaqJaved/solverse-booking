import { Injectable } from '@nestjs/common'
import {
  BusinessDeletedError,
  BusinessId,
  BusinessNotFoundError,
  BusinessSlug,
  BusinessSlugTakenError,
  DatabaseFailure,
  InvalidInputError,
  UpdateBusinessSlugUsecase,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class UpdateBusinessSlugUsecaseImpl implements UpdateBusinessSlugUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    businessId,
    slug,
    actorId,
  }: {
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
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(BusinessId)(businessId)
      const decodedSlug = yield* decodeOrFail(BusinessSlug)(slug)
      const decodedActorId = yield* decodeOrFail(UserId)(actorId)

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

      const updated = yield* maybeBusiness.value.updateSlug(decodedSlug, decodedActorId)

      yield* this.repositoryFactory.businessRepository.save(updated)
    })
  }
}
