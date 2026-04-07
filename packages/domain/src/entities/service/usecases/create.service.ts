import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { Service } from '../service.aggregate'
import { ServiceNameTakenError } from '../errors/entry'

export const ICreateServiceUsecase = Symbol('ICreateServiceUsecase')

export interface CreateServiceUsecase {
  execute(params: {
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
    InvalidInputError | DatabaseFailure | ServiceNameTakenError
  >
}
