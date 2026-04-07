import { Effect, Option } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { TimeOff } from '../timeoff.aggregate'

export const IGetTimeOffUsecase = Symbol('IGetTimeOffUsecase')

export interface GetTimeOffUsecase {
  execute(params: {
    id: string
    businessId: string
  }): Effect.Effect<Option.Option<TimeOff>, InvalidInputError | DatabaseFailure>
}
