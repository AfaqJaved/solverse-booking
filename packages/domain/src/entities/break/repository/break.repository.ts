import { Effect } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import { Break } from '../break.aggregate'
import { BreakId } from '../entry'
import { WorkingHoursId } from '../../working-hours/entry'

export const IBreakRepository = Symbol('IBreakRepository')

export interface BreakRepository {
  findByWorkingHoursId(
    workingHoursId: WorkingHoursId,
  ): Effect.Effect<Break[], DatabaseFailure>
  save(breakEntity: Break): Effect.Effect<void, DatabaseFailure>
  delete(id: BreakId): Effect.Effect<void, DatabaseFailure>
}
