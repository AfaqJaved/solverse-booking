import { Injectable } from '@nestjs/common'
import {
  BusinessId,
  BusinessNotFoundError,
  DatabaseFailure,
  DeactivateBusinessUsecase,
  InvalidBusinessTransitionError,
  InvalidInputError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class DeactivateBusinessUsecaseImpl implements DeactivateBusinessUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    businessId,
    actorId,
  }: {
    businessId: string
    actorId: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | BusinessNotFoundError
    | InvalidBusinessTransitionError
    | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(BusinessId)(businessId)
      const decodedActorId = yield* decodeOrFail(UserId)(actorId)

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

      const deactivated = yield* maybeBusiness.value.deactivate(decodedActorId)

      yield* this.repositoryFactory.businessRepository.save(deactivated)
    })
  }
}
