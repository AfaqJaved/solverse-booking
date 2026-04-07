import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { WorkingHours } from '../working.hours.aggregate'
import { WorkingHoursNotFoundError } from '../errors/entry'

export const IGetWorkingHoursUsecase = Symbol('IGetWorkingHoursUsecase')

export interface GetWorkingHoursUsecase {
  execute(params: {
    id: string
  }): Effect.Effect<
    WorkingHours,
    InvalidInputError | DatabaseFailure | WorkingHoursNotFoundError
  >
}
