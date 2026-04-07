import { Injectable } from '@nestjs/common'
import {
  ServiceId,
  ServiceName,
  ServiceDuration,
  ServicePrice,
  DatabaseFailure,
  InvalidInputError,
  UpdateServiceUsecase,
  ServiceNotFoundError,
  ServiceDeletedError,
  ServiceNameTakenError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class UpdateServiceUsecaseImpl implements UpdateServiceUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    serviceId,
    updatedBy,
    name,
    description,
    duration,
    bufferTime,
    price,
    color,
    maxBookingsPerSlot,
  }: {
    serviceId: string
    updatedBy: string
    name?: string
    description?: string | null
    duration?: number
    bufferTime?: number
    price?: number
    color?: string | null
    maxBookingsPerSlot?: number
  }): Effect.Effect<
    void,
    | InvalidInputError
    | ServiceNotFoundError
    | ServiceDeletedError
    | ServiceNameTakenError
    | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedServiceId = yield* decodeOrFail(ServiceId)(serviceId)
      const updatedByUserId = yield* decodeOrFail(UserId)(updatedBy)

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

      const updateDetails: any = {}
      if (name !== undefined) {
        updateDetails.name = yield* decodeOrFail(ServiceName)(name)
      }
      if (duration !== undefined) {
        updateDetails.duration = yield* decodeOrFail(ServiceDuration)(duration)
      }
      if (price !== undefined) {
        updateDetails.price = yield* decodeOrFail(ServicePrice)(price)
      }
      if (description !== undefined) updateDetails.description = description
      if (bufferTime !== undefined) updateDetails.bufferTime = bufferTime
      if (color !== undefined) updateDetails.color = color
      if (maxBookingsPerSlot !== undefined)
        updateDetails.maxBookingsPerSlot = maxBookingsPerSlot

      if (name !== undefined) {
        const nameTaken =
          yield* this.repositoryFactory.serviceRepository.nameExistsForBusiness(
            service.businessId,
            updateDetails.name,
            decodedServiceId,
          )

        if (nameTaken) {
          return yield* Effect.fail(
            new ServiceNameTakenError({
              message: `Service name "${name}" is already taken for this business`,
              cause: `Service name "${name}" is already taken for this business`,
            }),
          )
        }
      }

      const updatedService = yield* service.updateDetails(
        updateDetails,
        updatedByUserId,
      )

      yield* this.repositoryFactory.serviceRepository.save(updatedService)
    })
  }
}
