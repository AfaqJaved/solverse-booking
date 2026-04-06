import { Injectable } from '@nestjs/common'
import {
  BusinessDeletedError,
  BusinessId,
  BusinessNotFoundError,
  DatabaseFailure,
  InvalidBusinessTransitionError,
  InvalidInputError,
  ReactivateBusinessUsecase,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class ReactivateBusinessUsecaseImpl implements ReactivateBusinessUsecase {
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
    | BusinessDeletedError
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

      const reactivated = yield* maybeBusiness.value.reactivate(decodedActorId)

      yield* this.repositoryFactory.businessRepository.save(reactivated)
    })
  }
}
