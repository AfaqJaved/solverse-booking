import { Injectable } from '@nestjs/common'
import {
  ServiceId,
  DatabaseFailure,
  InvalidInputError,
  DeleteServiceUsecase,
  ServiceNotFoundError,
  ServiceDeletedError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class DeleteServiceUsecaseImpl implements DeleteServiceUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    serviceId,
    deletedBy,
  }: {
    serviceId: string
    deletedBy: string
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
      const userId: UserId = yield* decodeOrFail(UserId)(deletedBy)
      const updatedService = yield* service.softDelete(userId)

      yield* this.repositoryFactory.serviceRepository.save(updatedService)
    })
  }
}
