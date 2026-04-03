import { Schema } from 'effect'
import { WorkingHoursId } from '../working-hours/entry'
import { BreakId } from './entry'
import { TimeOfDay, AuditSchema } from '../common/entry'

export const BreakSchema = Schema.Struct({
  id: BreakId,
  workingHoursId: WorkingHoursId,
  startTime: TimeOfDay,
  endTime: TimeOfDay,
  ...AuditSchema.fields,
})

export type BreakData = typeof BreakSchema.Type
