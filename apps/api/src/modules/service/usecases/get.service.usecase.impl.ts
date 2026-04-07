import { Injectable } from '@nestjs/common'
import {
  ServiceId,
  DatabaseFailure,
  InvalidInputError,
  GetServiceUsecase,
  ServiceNotFoundError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class GetServiceUsecaseImpl implements GetServiceUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    serviceId,
  }: {
    serviceId: string
  }): Effect.Effect<
    import('@solverse/domain').Service,
    InvalidInputError | ServiceNotFoundError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedServiceId = yield* decodeOrFail(ServiceId)(serviceId)

      const serviceOption =
        yield* this.repositoryFactory.serviceRepository.findById(
          decodedServiceId,
        )

      if (Option.isNone(serviceOption)) {
        return yield* Effect.fail(
          new ServiceNotFoundError({
            message: `Service with ID "${decodedServiceId}" not found`,
            cause: `Service with ID "${decodedServiceId}" not found`,
          }),
        )
      }

      return serviceOption.value
    })
  }
}
