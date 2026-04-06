import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { Break } from '../break.aggregate'

export const IGetBreaksByWorkingHoursUsecase = Symbol('IGetBreaksByWorkingHoursUsecase')

export interface GetBreaksByWorkingHoursUsecase {
  execute(params: {
    workingHoursId: string
  }): Effect.Effect<Break[], InvalidInputError | DatabaseFailure>
}