import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { WorkingHours } from '../working.hours.aggregate'
import { WorkingHoursDayTakenError } from '../errors/entry'

export const ICreateWorkingHoursUsecase = Symbol('ICreateWorkingHoursUsecase')

export interface CreateWorkingHoursUsecase {
  execute(params: {
    id: string
    businessId: string
    dayOfWeek: string
    isOpen: boolean
    openTime?: string | null
    closeTime?: string | null
    createdBy: string
  }): Effect.Effect<
    WorkingHours,
    InvalidInputError | DatabaseFailure | WorkingHoursDayTakenError
  >
}
