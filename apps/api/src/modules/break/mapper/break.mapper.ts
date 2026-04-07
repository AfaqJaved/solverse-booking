import { Break } from '@solverse/domain'
import { BreakApi } from '@solverse/shared'

export class BreakMapper {
  static breakAggregateToCreateResponse(
    breakEntity: Break,
  ): BreakApi.Create.Response {
    const data = breakEntity.toRaw()
    return {
      id: data.id,
      workingHoursId: data.workingHoursId,
      label: data.label,
      startTime: data.startTime,
      endTime: data.endTime,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt.toISOString(),
    }
  }

  static breakAggregateToGetResponse(
    breakEntity: Break,
  ): BreakApi.GetBreak.Response {
    const data = breakEntity.toRaw()
    return {
      id: data.id,
      workingHoursId: data.workingHoursId,
      label: data.label,
      startTime: data.startTime,
      endTime: data.endTime,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    }
  }

  static breakAggregatesToGetByWorkingHoursResponse(
    breaks: Break[],
  ): BreakApi.GetBreaksByWorkingHours.Response {
    return {
      breaks: breaks.map((breakEntity) => {
        const data = breakEntity.toRaw()
        return {
          id: data.id,
          workingHoursId: data.workingHoursId,
          label: data.label,
          startTime: data.startTime,
          endTime: data.endTime,
          isDeleted: data.isDeleted,
          createdAt: data.createdAt.toISOString(),
          updatedAt: data.updatedAt.toISOString(),
        }
      }),
    }
  }
}
