import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { BreakNotFoundError, BreakDeletedError } from '../errors/entry'

export const IDeleteBreakUsecase = Symbol('IDeleteBreakUsecase')

export interface DeleteBreakUsecase {
  execute(params: {
    breakId: string
    deletedBy: string
  }): Effect.Effect<
    void,
    InvalidInputError | BreakNotFoundError | BreakDeletedError | DatabaseFailure
  >
}
