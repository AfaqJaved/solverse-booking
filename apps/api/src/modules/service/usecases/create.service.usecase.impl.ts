import { Injectable } from '@nestjs/common'
import {
  Service,
  ServiceId,
  ServiceName,
  ServiceDuration,
  ServicePrice,
  BusinessId,
  DatabaseFailure,
  InvalidInputError,
  CreateServiceUsecase,
  UserId,
} from '@solverse/domain'
import { ServiceNameTakenError } from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class CreateServiceUsecaseImpl implements CreateServiceUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    id,
    businessId,
    name,
    duration,
    price,
    createdBy,
    description,
    bufferTime,
    color,
    maxBookingsPerSlot,
    status,
  }: {
    id: string
    businessId: string
    name: string
    duration: number
    price: number
    createdBy: string
    description?: string | null
    bufferTime?: number
    color?: string | null
    maxBookingsPerSlot?: number
    status?: 'active' | 'inactive'
  }): Effect.Effect<
    Service,
    InvalidInputError | ServiceNameTakenError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(ServiceId)(id)
      const decodedBusinessId = yield* decodeOrFail(BusinessId)(businessId)
      const decodedName = yield* decodeOrFail(ServiceName)(name)
      const decodedDuration = yield* decodeOrFail(ServiceDuration)(duration)
      const decodedPrice = yield* decodeOrFail(ServicePrice)(price)
      const createdByUserId = yield* decodeOrFail(UserId)(createdBy)

      const nameTaken =
        yield* this.repositoryFactory.serviceRepository.nameExistsForBusiness(
          decodedBusinessId,
          decodedName,
        )

      if (nameTaken) {
        return yield* Effect.fail(
          new ServiceNameTakenError({
            message: `Service name "${decodedName}" is already taken for this business`,
            cause: `Service name "${decodedName}" is already taken for this business`,
          }),
        )
      }

      const service = Service.create({
        id: decodedId,
        businessId: decodedBusinessId,
        name: decodedName,
        duration: decodedDuration,
        price: decodedPrice,
        createdBy: createdByUserId,
        description,
        bufferTime,
        color,
        maxBookingsPerSlot,
        status,
      })

      yield* this.repositoryFactory.serviceRepository.save(service)

      return service
    })
  }
}

