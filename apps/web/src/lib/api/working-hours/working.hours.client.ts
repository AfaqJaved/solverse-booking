import type { WorkingHoursApi } from '@solverse/shared'
import { apiClient } from '../client/axios.client'

export const workingHoursClient = {
  create: async (data: WorkingHoursApi.Create.Request): Promise<WorkingHoursApi.Create.Response> => {
    const response = await apiClient.post<WorkingHoursApi.Create.Response>('/working-hours', data)
    return response.data
  },

  getById: async (workingHoursId: string): Promise<WorkingHoursApi.GetWorkingHours.Response> => {
    const response = await apiClient.get<WorkingHoursApi.GetWorkingHours.Response>(`/working-hours/${workingHoursId}`)
    return response.data
  },

  getByBusiness: async (businessId: string): Promise<WorkingHoursApi.ListWorkingHoursByBusiness.Response> => {
    const response = await apiClient.get<WorkingHoursApi.ListWorkingHoursByBusiness.Response>(`/working-hours/business/${businessId}`)
    return response.data
  },

  update: async (workingHoursId: string, data: WorkingHoursApi.Update.Request): Promise<WorkingHoursApi.GetWorkingHours.Response> => {
    const response = await apiClient.patch<WorkingHoursApi.GetWorkingHours.Response>(`/working-hours/${workingHoursId}`, data)
    return response.data
  },

  delete: async (workingHoursId: string, data: WorkingHoursApi.Delete.Request): Promise<void> => {
    await apiClient.delete(`/working-hours/${workingHoursId}`, { data })
  },
}