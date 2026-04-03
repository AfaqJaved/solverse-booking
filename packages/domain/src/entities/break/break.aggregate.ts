import { Effect, Schema } from 'effect'
import type { ParseError } from 'effect/ParseResult'
import { UserId } from '../user/entry'
import { WorkingHoursId } from '../working-hours/entry'
import { BreakId } from './entry'
import type { BreakData } from './break.entity'
import { BreakSchema } from './break.entity'
import { TimeOfDay } from 'entities/common/time.of.day'

export class Break {
  private constructor(private readonly data: BreakData) {}

  // ── Identity ───────────────────────────────────────────────────────────────

  get id(): BreakId {
    return this.data.id
  }

  get workingHoursId(): WorkingHoursId {
    return this.data.workingHoursId
  }

  get startTime(): TimeOfDay {
    return this.data.startTime
  }

  get endTime(): TimeOfDay {
    return this.data.endTime
  }

  get isDeleted(): boolean {
    return this.data.isDeleted
  }

  // ── Factory ────────────────────────────────────────────────────────────────

  static create(params: {
    id: BreakId
    workingHoursId: WorkingHoursId
    startTime: TimeOfDay
    endTime: TimeOfDay
    createdBy: UserId
  }): Break {
    const now = new Date()
    return new Break({
      id: params.id,
      workingHoursId: params.workingHoursId,
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
    startTime: TimeOfDay,
    endTime: TimeOfDay,
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
