import { Injectable } from '@nestjs/common'
import {
  BusinessId,
  DatabaseFailure,
  InvalidInputError,
  GetServicesByBusinessUsecase,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class GetServicesByBusinessUsecaseImpl implements GetServicesByBusinessUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    businessId,
  }: {
    businessId: string
  }): Effect.Effect<
    import('@solverse/domain').Service[],
    InvalidInputError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedBusinessId = yield* decodeOrFail(BusinessId)(businessId)

      const services =
        yield* this.repositoryFactory.serviceRepository.findByBusinessId(
          decodedBusinessId,
          {
            includeDeleted: false,
          },
        )

      return services
    })
  }
}
