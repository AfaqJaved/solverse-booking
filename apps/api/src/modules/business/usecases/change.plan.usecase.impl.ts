import { Injectable } from '@nestjs/common'
import {
  BusinessDeletedError,
  BusinessId,
  BusinessNotFoundError,
  BusinessPlan,
  BusinessPlanType,
  BusinessSuspendedError,
  ChangePlanUsecase,
  DatabaseFailure,
  InvalidInputError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class ChangePlanUsecaseImpl implements ChangePlanUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    businessId,
    plan,
    actorId,
  }: {
    businessId: string
    plan: BusinessPlanType
    actorId: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | BusinessNotFoundError
    | BusinessSuspendedError
    | BusinessDeletedError
    | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(BusinessId)(businessId)
      const decodedPlan = yield* decodeOrFail(BusinessPlan)(plan)
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

      const updated = yield* maybeBusiness.value.changePlan(
        decodedPlan,
        decodedActorId,
      )

      yield* this.repositoryFactory.businessRepository.save(updated)
    })
  }
}
