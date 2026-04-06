import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { BreakNotFoundError, BreakDeletedError, BreakTimeConflictError } from '../errors/entry'

export const IUpdateBreakTimesUsecase = Symbol('IUpdateBreakTimesUsecase')

export interface UpdateBreakTimesUsecase {
  execute(params: {
    breakId: string
    startTime: string
    endTime: string
    updatedBy: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | BreakNotFoundError
    | BreakDeletedError
    | BreakTimeConflictError
    | DatabaseFailure
  >
}