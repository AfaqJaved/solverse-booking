import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { TimeOff } from '../timeoff.aggregate'

export const IGetTimeOffsByBusinessUsecase = Symbol(
  'IGetTimeOffsByBusinessUsecase',
)

export interface GetTimeOffsByBusinessUsecase {
  execute(params: {
    businessId: string
    startDate?: Date
    endDate?: Date
    status?: 'active' | 'cancelled'
  }): Effect.Effect<TimeOff[], InvalidInputError | DatabaseFailure>
}
