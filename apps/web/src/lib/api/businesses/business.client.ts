import type { BusinessApi } from '@solverse/shared'
import { apiClient } from '../client/axios.client'

export const businessClient = {
  register: async (data: BusinessApi.Register.Request): Promise<BusinessApi.Register.Response> => {
    const response = await apiClient.post<BusinessApi.Register.Response>('/businesses', data)
    return response.data
  },

  getByOwner: async (ownerId: string): Promise<BusinessApi.GetBusiness.Response[]> => {
    const response = await apiClient.get<BusinessApi.GetBusiness.Response[]>(`/businesses/owner/${ownerId}`)
    return response.data
  },

  getById: async (businessId: string): Promise<BusinessApi.GetBusiness.Response> => {
    const response = await apiClient.get<BusinessApi.GetBusiness.Response>(`/businesses/${businessId}`)
    return response.data
  },

  updateProfile: async (businessId: string, data: BusinessApi.UpdateProfile.Request): Promise<void> => {
    await apiClient.patch(`/businesses/${businessId}/profile`, data)
  },

  updateSlug: async (businessId: string, data: BusinessApi.UpdateSlug.Request): Promise<void> => {
    await apiClient.patch(`/businesses/${businessId}/slug`, data)
  },

  changePlan: async (businessId: string, data: BusinessApi.ChangePlan.Request): Promise<void> => {
    await apiClient.patch(`/businesses/${businessId}/plan`, data)
  },

  activate: async (businessId: string, data: BusinessApi.Activate.Request): Promise<void> => {
    await apiClient.patch(`/businesses/${businessId}/activate`, data)
  },

  deactivate: async (businessId: string, data: BusinessApi.Deactivate.Request): Promise<void> => {
    await apiClient.patch(`/businesses/${businessId}/deactivate`, data)
  },

  reactivate: async (businessId: string, data: BusinessApi.Reactivate.Request): Promise<void> => {
    await apiClient.patch(`/businesses/${businessId}/reactivate`, data)
  },

  suspend: async (businessId: string, data: BusinessApi.Suspend.Request): Promise<void> => {
    await apiClient.patch(`/businesses/${businessId}/suspend`, data)
  },

  delete: async (businessId: string, data: BusinessApi.Delete.Request): Promise<void> => {
    await apiClient.delete(`/businesses/${businessId}`, { data })
  },
}