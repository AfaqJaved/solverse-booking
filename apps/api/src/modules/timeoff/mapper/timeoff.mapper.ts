import { TimeOff } from '@solverse/domain'
import { Injectable } from '@nestjs/common'
import { TimeOffApi } from '@solverse/shared'

@Injectable()
export class TimeOffMapper {
  toApi(timeOff: TimeOff): TimeOffApi.GetTimeOff.Response {
    const data = timeOff.toJSON()
    return {
      id: data.id,
      businessId: data.businessId,
      label: data.label,
      allDay: data.allDay,
      cadence: data.cadence,
      status: data.status,
      startDate: data.startDate.toISOString().split('T')[0]!,
      endDate: data.endDate.toISOString().split('T')[0]!,
      startTime: data.startTime,
      endTime: data.endTime,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    }
  }
}
