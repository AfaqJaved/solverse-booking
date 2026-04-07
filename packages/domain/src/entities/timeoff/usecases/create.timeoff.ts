import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  TimeOffDateRangeError,
  TimeOffTimeRangeError,
  TimeOffError,
} from '../errors/entry'

export const ICreateTimeOffUsecase = Symbol('ICreateTimeOffUsecase')

export interface CreateTimeOffUsecase {
  execute(params: {
    businessId: string
    label: string
    allDay: boolean
    cadence: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
    startDate: Date
    endDate: Date
    startTime?: string | null
    endTime?: string | null
    actorId: string | null
  }): Effect.Effect<
    { id: string },
    | InvalidInputError
    | TimeOffDateRangeError
    | TimeOffTimeRangeError
    | TimeOffError
    | DatabaseFailure
  >
}
