import { Effect, Option } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import { WorkingHours } from '../working.hours.aggregate'
import { WorkingHoursId, DayOfWeek } from '../entry'
import { BusinessId } from '../../business/entry'

export const IWorkingHoursRepository = Symbol('IWorkingHoursRepository')

export interface WorkingHoursRepository {
  findByBusinessId(
    businessId: BusinessId,
  ): Effect.Effect<WorkingHours[], DatabaseFailure>
  findByBusinessIdAndDay(
    businessId: BusinessId,
    day: DayOfWeek,
  ): Effect.Effect<Option.Option<WorkingHours>, DatabaseFailure>
  save(workingHours: WorkingHours): Effect.Effect<void, DatabaseFailure>
  saveMany(workingHours: WorkingHours[]): Effect.Effect<void, DatabaseFailure>
  delete(id: WorkingHoursId): Effect.Effect<void, DatabaseFailure>
}
