import { WorkingHours } from '@solverse/domain'
import { WorkingHoursApi } from '@solverse/shared'

export class WorkingHoursMapper {
  static workingHoursAggregateToCreateResponse(
    workingHours: WorkingHours,
  ): WorkingHoursApi.Create.Response {
    const data = workingHours.toRaw()
    return {
      id: data.id,
      businessId: data.businessId,
      dayOfWeek: data.dayOfWeek,
      isOpen: data.isOpen,
      openTime: data.openTime,
      closeTime: data.closeTime,
      createdAt: data.createdAt.toISOString(),
    }
  }

  static workingHoursAggregateToGetResponse(
    workingHours: WorkingHours,
  ): WorkingHoursApi.GetWorkingHours.Response {
    const data = workingHours.toRaw()
    return {
      id: data.id,
      businessId: data.businessId,
      dayOfWeek: data.dayOfWeek,
      isOpen: data.isOpen,
      openTime: data.openTime,
      closeTime: data.closeTime,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    }
  }

  static workingHoursAggregatesToListResponse(
    workingHoursArr: WorkingHours[],
  ): WorkingHoursApi.ListWorkingHoursByBusiness.Response {
    return {
      workingHours: workingHoursArr.map((workingHours) => {
        const data = workingHours.toRaw()
        return {
          id: data.id,
          businessId: data.businessId,
          dayOfWeek: data.dayOfWeek,
          isOpen: data.isOpen,
          openTime: data.openTime,
          closeTime: data.closeTime,
          isDeleted: data.isDeleted,
          createdAt: data.createdAt.toISOString(),
          updatedAt: data.updatedAt.toISOString(),
        }
      }),
    }
  }
}
