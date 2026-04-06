import { Injectable } from '@nestjs/common'
import {
  Business,
  BusinessId,
  BusinessNotFoundError,
  DatabaseFailure,
  GetBusinessUsecase,
  InvalidInputError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class GetBusinessUsecaseImpl implements GetBusinessUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    businessId,
  }: {
    businessId: string
  }): Effect.Effect<Business, InvalidInputError | BusinessNotFoundError | DatabaseFailure> {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(BusinessId)(businessId)

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

      return maybeBusiness.value
    })
  }
}
