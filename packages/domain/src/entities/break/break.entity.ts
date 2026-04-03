import { Schema } from 'effect'
import { AuditSchema, TimeOfDay } from 'entities/common/entry'
import { WorkingHoursId } from '../working-hours/entry'
import { BreakId } from './entry'

export const BreakSchema = Schema.Struct({
  id: BreakId,
  workingHoursId: WorkingHoursId,
  startTime: TimeOfDay,
  endTime: TimeOfDay,
  ...AuditSchema.fields,
})

export type BreakData = typeof BreakSchema.Type
