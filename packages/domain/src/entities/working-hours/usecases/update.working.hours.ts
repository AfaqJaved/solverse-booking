import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { WorkingHours } from '../working.hours.aggregate'
import {
  WorkingHoursNotFoundError,
  WorkingHoursDeletedError,
} from '../errors/entry'

export const IUpdateWorkingHoursUsecase = Symbol('IUpdateWorkingHoursUsecase')

export interface UpdateWorkingHoursUsecase {
  execute(params: {
    id: string
    isOpen?: boolean
    openTime?: string | null
    closeTime?: string | null
    updatedBy: string
  }): Effect.Effect<
    WorkingHours,
    | InvalidInputError
    | DatabaseFailure
    | WorkingHoursNotFoundError
    | WorkingHoursDeletedError
  >
}
