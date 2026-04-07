import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { BreakNotFoundError } from '../errors/entry'
import { Break } from '../break.aggregate'

export const IGetBreakUsecase = Symbol('IGetBreakUsecase')

export interface GetBreakUsecase {
  execute(params: {
    breakId: string
  }): Effect.Effect<
    Break,
    InvalidInputError | BreakNotFoundError | DatabaseFailure
  >
}
