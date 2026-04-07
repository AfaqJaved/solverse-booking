import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { WorkingHours } from '../working.hours.aggregate'

export const IListWorkingHoursByBusinessUsecase = Symbol(
  'IListWorkingHoursByBusinessUsecase',
)

export interface ListWorkingHoursByBusinessUsecase {
  execute(params: {
    businessId: string
  }): Effect.Effect<WorkingHours[], InvalidInputError | DatabaseFailure>
}
