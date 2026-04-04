import { Schema } from 'effect'
import { WorkingHoursId } from '../working-hours/entry'
import { BreakId } from './entry'
import { TimeOfDay, AuditSchema } from '../common/entry'

export const BreakSchema = Schema.Struct({
  id: BreakId,
  workingHoursId: WorkingHoursId,
  label: Schema.String.pipe(Schema.maxLength(100)),
  startTime: TimeOfDay,
  endTime: TimeOfDay,
  ...AuditSchema.fields,
})

export type BreakData = typeof BreakSchema.Type
