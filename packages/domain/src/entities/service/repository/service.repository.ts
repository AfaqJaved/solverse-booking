import { Effect, Option } from 'effect'
import { BusinessId } from '../../business/entry'
import { DatabaseFailure } from '../../../errors/entry'
import { Service } from '../service.aggregate'
import { ServiceId } from '../entry'

export const IServiceRepository = Symbol('IServiceRepository')

export interface ServiceRepository {
  findById(
    id: ServiceId,
  ): Effect.Effect<Option.Option<Service>, DatabaseFailure>
  findByBusinessId(
    businessId: BusinessId,
  ): Effect.Effect<Service[], DatabaseFailure>
  save(service: Service): Effect.Effect<void, DatabaseFailure>
  delete(id: ServiceId): Effect.Effect<void, DatabaseFailure>
}
