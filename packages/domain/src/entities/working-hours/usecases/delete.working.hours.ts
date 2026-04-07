import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  WorkingHoursNotFoundError,
  WorkingHoursDeletedError,
} from '../errors/entry'

export const IDeleteWorkingHoursUsecase = Symbol('IDeleteWorkingHoursUsecase')

export interface DeleteWorkingHoursUsecase {
  execute(params: {
    id: string
    deletedBy: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | DatabaseFailure
    | WorkingHoursNotFoundError
    | WorkingHoursDeletedError
  >
}
