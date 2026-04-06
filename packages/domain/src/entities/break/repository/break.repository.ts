import { Effect, Option } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import { Break } from '../break.aggregate'
import { BreakId } from '../entry'
import { WorkingHoursId } from '../../working-hours/entry'

export const IBreakRepository = Symbol('IBreakRepository')

export interface BreakRepository {
  findById(id: BreakId): Effect.Effect<Option.Option<Break>, DatabaseFailure>
  
  findByWorkingHoursId(
    workingHoursId: WorkingHoursId,
    options?: {
      includeDeleted?: boolean
    }
  ): Effect.Effect<Break[], DatabaseFailure>
  
  countByWorkingHoursId(
    workingHoursId: WorkingHoursId,
    options?: {
      includeDeleted?: boolean
    }
  ): Effect.Effect<number, DatabaseFailure>
  
  hasTimeConflict(
    workingHoursId: WorkingHoursId,
    startTime: string,
    endTime: string,
    excludeBreakId?: BreakId
  ): Effect.Effect<boolean, DatabaseFailure>
  
  save(breakEntity: Break): Effect.Effect<void, DatabaseFailure>
  delete(id: BreakId): Effect.Effect<void, DatabaseFailure>
}
