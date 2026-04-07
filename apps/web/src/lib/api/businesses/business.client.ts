import type { BusinessApi } from '@solverse/shared'
import { APICONSTANTS } from '@solverse/shared'
import { apiClient } from '../client/axios.client'

export const businessClient = {
  register: async (data: BusinessApi.Register.Request): Promise<BusinessApi.Register.Response> => {
    const response = await apiClient.post<BusinessApi.Register.Response>(APICONSTANTS.BUSINESSES.CREATE, data)
    return response.data
  },

  getByOwner: async (ownerId: string): Promise<BusinessApi.GetBusiness.Response[]> => {
    const response = await apiClient.get<BusinessApi.GetBusiness.Response[]>(APICONSTANTS.BUSINESSES.GET_BY_OWNER(ownerId))
    return response.data
  },

  getById: async (businessId: string): Promise<BusinessApi.GetBusiness.Response> => {
    const response = await apiClient.get<BusinessApi.GetBusiness.Response>(APICONSTANTS.BUSINESSES.GET_BY_ID(businessId))
    return response.data
  },

  updateProfile: async (businessId: string, data: BusinessApi.UpdateProfile.Request): Promise<void> => {
    await apiClient.patch(APICONSTANTS.BUSINESSES.UPDATE_PROFILE(businessId), data)
  },

  updateSlug: async (businessId: string, data: BusinessApi.UpdateSlug.Request): Promise<void> => {
    await apiClient.patch(APICONSTANTS.BUSINESSES.UPDATE_SLUG(businessId), data)
  },

  changePlan: async (businessId: string, data: BusinessApi.ChangePlan.Request): Promise<void> => {
    await apiClient.patch(APICONSTANTS.BUSINESSES.CHANGE_PLAN(businessId), data)
  },

  activate: async (businessId: string, data: BusinessApi.Activate.Request): Promise<void> => {
    await apiClient.patch(APICONSTANTS.BUSINESSES.ACTIVATE(businessId), data)
  },

  deactivate: async (businessId: string, data: BusinessApi.Deactivate.Request): Promise<void> => {
    await apiClient.patch(APICONSTANTS.BUSINESSES.DEACTIVATE(businessId), data)
  },

  reactivate: async (businessId: string, data: BusinessApi.Reactivate.Request): Promise<void> => {
    await apiClient.patch(APICONSTANTS.BUSINESSES.REACTIVATE(businessId), data)
  },

  suspend: async (businessId: string, data: BusinessApi.Suspend.Request): Promise<void> => {
    await apiClient.patch(APICONSTANTS.BUSINESSES.SUSPEND(businessId), data)
  },

  delete: async (businessId: string, data: BusinessApi.Delete.Request): Promise<void> => {
    await apiClient.delete(APICONSTANTS.BUSINESSES.DELETE(businessId), { data })
  },
}