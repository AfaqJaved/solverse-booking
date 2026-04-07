import type { ServiceApi } from '@solverse/shared'
import { APICONSTANTS } from '@solverse/shared'
import { apiClient } from '../client/axios.client'

export const serviceClient = {
  create: async (data: ServiceApi.Create.Request): Promise<ServiceApi.Create.Response> => {
    const response = await apiClient.post<ServiceApi.Create.Response>(APICONSTANTS.SERVICES.CREATE, data)
    return response.data
  },

  getById: async (serviceId: string): Promise<ServiceApi.GetService.Response> => {
    const response = await apiClient.get<ServiceApi.GetService.Response>(APICONSTANTS.SERVICES.GET_BY_ID(serviceId))
    return response.data
  },

  getByBusiness: async (businessId: string): Promise<ServiceApi.GetServicesByBusiness.Response> => {
    const response = await apiClient.get<ServiceApi.GetServicesByBusiness.Response>(APICONSTANTS.SERVICES.GET_BY_BUSINESS(businessId))
    return response.data
  },

  update: async (serviceId: string, data: ServiceApi.Update.Request): Promise<void> => {
    await apiClient.patch(APICONSTANTS.SERVICES.UPDATE(serviceId), data)
  },

  activate: async (serviceId: string, data: ServiceApi.Activate.Request): Promise<void> => {
    await apiClient.patch(APICONSTANTS.SERVICES.ACTIVATE(serviceId), data)
  },

  deactivate: async (serviceId: string, data: ServiceApi.Deactivate.Request): Promise<void> => {
    await apiClient.patch(APICONSTANTS.SERVICES.DEACTIVATE(serviceId), data)
  },

  delete: async (serviceId: string, data: ServiceApi.Delete.Request): Promise<void> => {
    await apiClient.delete(APICONSTANTS.SERVICES.DELETE(serviceId), { data })
  },
}