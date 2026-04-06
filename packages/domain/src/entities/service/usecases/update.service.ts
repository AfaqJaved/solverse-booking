import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  ServiceNotFoundError,
  ServiceDeletedError,
  ServiceNameTakenError,
} from '../errors/entry'

export const IUpdateServiceUsecase = Symbol('IUpdateServiceUsecase')

export interface UpdateServiceUsecase {
  execute(params: {
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
    | DatabaseFailure
    | ServiceNameTakenError
  >
}

