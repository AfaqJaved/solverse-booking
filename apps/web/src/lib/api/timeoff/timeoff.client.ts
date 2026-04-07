import type { TimeOffApi } from '@solverse/shared'
import { apiClient } from '../client/axios.client'

export const timeoffClient = {
  create: async (businessId: string, data: TimeOffApi.CreateTimeOff.Request): Promise<TimeOffApi.CreateTimeOff.Response> => {
    const response = await apiClient.post<TimeOffApi.CreateTimeOff.Response>(`/businesses/${businessId}/timeoff`, data)
    return response.data
  },

  getAll: async (businessId: string, params?: TimeOffApi.GetTimeOffs.QueryParams): Promise<TimeOffApi.GetTimeOffs.Response> => {
    const response = await apiClient.get<TimeOffApi.GetTimeOffs.Response>(`/businesses/${businessId}/timeoff`, {
      params
    })
    return response.data
  },

  getById: async (businessId: string, id: string): Promise<TimeOffApi.GetTimeOff.Response> => {
    const response = await apiClient.get<TimeOffApi.GetTimeOff.Response>(`/businesses/${businessId}/timeoff/${id}`)
    return response.data
  },

  update: async (businessId: string, id: string, data: TimeOffApi.UpdateTimeOff.Request): Promise<void> => {
    await apiClient.put(`/businesses/${businessId}/timeoff/${id}`, data)
  },

  delete: async (businessId: string, id: string): Promise<void> => {
    await apiClient.delete(`/businesses/${businessId}/timeoff/${id}`)
  },

  cancel: async (businessId: string, id: string): Promise<void> => {
    await apiClient.post(`/businesses/${businessId}/timeoff/${id}/cancel`)
  },
}