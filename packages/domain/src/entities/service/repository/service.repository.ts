import { Effect, Option } from 'effect'
import { BusinessId } from '../../business/entry'
import { DatabaseFailure } from '../../../errors/entry'
import { Service } from '../service.aggregate'
import { ServiceId, ServiceStatus, ServiceName } from '../entry'

export const IServiceRepository = Symbol('IServiceRepository')

export interface ServiceRepository {
  findById(
    id: ServiceId,
  ): Effect.Effect<Option.Option<Service>, DatabaseFailure>
  findByBusinessId(
    businessId: BusinessId,
    options?: {
      status?: ServiceStatus
      includeDeleted?: boolean
    },
  ): Effect.Effect<Service[], DatabaseFailure>
  countByBusinessId(
    businessId: BusinessId,
    options?: {
      status?: ServiceStatus
      includeDeleted?: boolean
    },
  ): Effect.Effect<number, DatabaseFailure>
  nameExistsForBusiness(
    businessId: BusinessId,
    name: ServiceName,
    excludeServiceId?: ServiceId,
  ): Effect.Effect<boolean, DatabaseFailure>
  save(service: Service): Effect.Effect<void, DatabaseFailure>
  delete(id: ServiceId): Effect.Effect<void, DatabaseFailure>
}
