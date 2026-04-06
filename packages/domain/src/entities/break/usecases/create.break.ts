import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { Break } from '../break.aggregate'
import { BreakTimeConflictError } from '../errors/entry'

export const ICreateBreakUsecase = Symbol('ICreateBreakUsecase')

export interface CreateBreakUsecase {
  execute(params: {
    id: string
    workingHoursId: string
    label: string
    startTime: string
    endTime: string
    createdBy: string
  }): Effect.Effect<
    Break,
    InvalidInputError | BreakTimeConflictError | DatabaseFailure
  >
}