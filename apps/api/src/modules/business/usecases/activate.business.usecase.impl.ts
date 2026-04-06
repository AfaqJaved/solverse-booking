import { Injectable } from '@nestjs/common'
import {
  ActivateBusinessUsecase,
  BusinessAlreadyActiveError,
  BusinessId,
  BusinessNotFoundError,
  DatabaseFailure,
  InvalidBusinessTransitionError,
  InvalidInputError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class ActivateBusinessUsecaseImpl implements ActivateBusinessUsecase {
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
    | BusinessAlreadyActiveError
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

      const activated = yield* maybeBusiness.value.activate(decodedActorId)

      yield* this.repositoryFactory.businessRepository.save(activated)
    })
  }
}
