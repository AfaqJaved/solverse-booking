import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  TimeOffDateRangeError,
  TimeOffTimeRangeError,
  TimeOffError,
} from '../errors/entry'

export const IUpdateTimeOffUsecase = Symbol('IUpdateTimeOffUsecase')

export interface UpdateTimeOffUsecase {
  execute(params: {
    id: string
    businessId: string
    label?: string
    startDate?: Date
    endDate?: Date
    startTime?: string | null
    endTime?: string | null
    actorId: string | null
  }): Effect.Effect<
    void,
    | InvalidInputError
    | TimeOffDateRangeError
    | TimeOffTimeRangeError
    | TimeOffError
    | DatabaseFailure
  >
}
