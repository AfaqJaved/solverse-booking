import { Schema } from 'effect'
import { WorkingHoursId } from '../working-hours/entry'
import { BreakId } from './entry'
import { AuditSchema } from '../common/entry'
import { BreakTimeOfDay } from './value-objects/time.of.day'

export const BreakSchema = Schema.Struct({
  id: BreakId,
  workingHoursId: WorkingHoursId,
  label: Schema.String.pipe(Schema.maxLength(100)),
  startTime: BreakTimeOfDay,
  endTime: BreakTimeOfDay,
  ...AuditSchema.fields,
})

export type BreakData = typeof BreakSchema.Type
