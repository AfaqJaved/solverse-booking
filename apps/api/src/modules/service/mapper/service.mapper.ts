import { Service } from '@solverse/domain'
import { ServiceApi } from '@solverse/shared'

export class ServiceMapper {
  static serviceAggregateToCreateResponse(
    service: Service,
  ): ServiceApi.Create.Response {
    const data = service.toRaw()
    return {
      id: data.id,
      businessId: data.businessId,
      name: data.name,
      description: data.description,
      duration: data.duration,
      bufferTime: data.bufferTime,
      price: data.price,
      status: data.status,
      color: data.color,
      maxBookingsPerSlot: data.maxBookingsPerSlot,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt.toISOString(),
    }
  }

  static serviceAggregateToGetResponse(
    service: Service,
  ): ServiceApi.GetService.Response {
    const data = service.toRaw()
    return {
      id: data.id,
      businessId: data.businessId,
      name: data.name,
      description: data.description,
      duration: data.duration,
      bufferTime: data.bufferTime,
      price: data.price,
      status: data.status,
      color: data.color,
      maxBookingsPerSlot: data.maxBookingsPerSlot,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    }
  }

  static serviceAggregatesToGetByBusinessResponse(
    services: Service[],
  ): ServiceApi.GetServicesByBusiness.Response {
    return {
      services: services.map((service) => {
        const data = service.toRaw()
        return {
          id: data.id,
          businessId: data.businessId,
          name: data.name,
          description: data.description,
          duration: data.duration,
          bufferTime: data.bufferTime,
          price: data.price,
          status: data.status,
          color: data.color,
          maxBookingsPerSlot: data.maxBookingsPerSlot,
          isDeleted: data.isDeleted,
          createdAt: data.createdAt.toISOString(),
          updatedAt: data.updatedAt.toISOString(),
        }
      }),
    }
  }
}

