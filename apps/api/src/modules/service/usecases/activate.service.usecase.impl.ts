import { Injectable } from '@nestjs/common'
import {
  ServiceId,
  DatabaseFailure,
  InvalidInputError,
  ActivateServiceUsecase,
  ServiceNotFoundError,
  ServiceDeletedError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class ActivateServiceUsecaseImpl implements ActivateServiceUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    serviceId,
    updatedBy,
  }: {
    serviceId: string
    updatedBy: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | ServiceNotFoundError
    | ServiceDeletedError
    | DatabaseFailure
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

      const service = serviceOption.value
      const userId: UserId = yield* decodeOrFail(UserId)(updatedBy)
      const updatedService = yield* service.activate(userId)

      yield* this.repositoryFactory.serviceRepository.save(updatedService)
    })
  }
}
