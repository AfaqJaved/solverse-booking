import { Effect, Schema } from 'effect'
import type { ParseError } from 'effect/ParseResult'
import { UserId } from '../user/entry'
import { WorkingHoursId } from '../working-hours/entry'
import { BreakId } from './entry'
import type { BreakData } from './break.entity'
import { BreakSchema } from './break.entity'
import { BreakTimeOfDay } from './value-objects/time.of.day'

export class Break {
  private constructor(private readonly data: BreakData) {}

  // ── Identity ───────────────────────────────────────────────────────────────

  get id(): BreakId {
    return this.data.id
  }

  get workingHoursId(): WorkingHoursId {
    return this.data.workingHoursId
  }

  get label(): string {
    return this.data.label
  }

  get startTime(): BreakTimeOfDay {
    return this.data.startTime
  }

  get endTime(): BreakTimeOfDay {
    return this.data.endTime
  }

  get isDeleted(): boolean {
    return this.data.isDeleted
  }

  // ── Factory ────────────────────────────────────────────────────────────────

  static create(params: {
    id: BreakId
    workingHoursId: WorkingHoursId
    label: string
    startTime: BreakTimeOfDay
    endTime: BreakTimeOfDay
    createdBy: UserId
  }): Break {
    const now = new Date()
    return new Break({
      id: params.id,
      workingHoursId: params.workingHoursId,
      label: params.label,
      startTime: params.startTime,
      endTime: params.endTime,
      createdAt: now,
      createdBy: params.createdBy,
      updatedAt: now,
      updatedBy: params.createdBy,
      deletedAt: null,
      deletedBy: null,
      isDeleted: false,
    })
  }

  static fromRaw(raw: unknown): Effect.Effect<Break, ParseError, never> {
    return Schema.decodeUnknown(BreakSchema)(raw).pipe(
      Effect.map((data) => new Break(data)),
    )
  }

  // ── Behaviour ──────────────────────────────────────────────────────────────

  updateTimes(
    startTime: BreakTimeOfDay,
    endTime: BreakTimeOfDay,
    updatedBy: UserId,
  ): Break {
    return new Break({
      ...this.data,
      startTime,
      endTime,
      updatedAt: new Date(),
      updatedBy,
    })
  }

  softDelete(deletedBy: UserId): Break {
    const now = new Date()
    return new Break({
      ...this.data,
      isDeleted: true,
      deletedAt: now,
      deletedBy,
      updatedAt: now,
      updatedBy: deletedBy,
    })
  }

  // ── Serialization ──────────────────────────────────────────────────────────

  toRaw(): BreakData {
    return this.data
  }
}
