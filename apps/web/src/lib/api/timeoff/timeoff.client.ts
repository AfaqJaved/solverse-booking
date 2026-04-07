import type { TimeOffApi } from '@solverse/shared'
import { APICONSTANTS } from '@solverse/shared'
import { apiClient } from '../client/axios.client'

export const timeoffClient = {
  create: async (businessId: string, data: TimeOffApi.CreateTimeOff.Request): Promise<TimeOffApi.CreateTimeOff.Response> => {
    const response = await apiClient.post<TimeOffApi.CreateTimeOff.Response>(APICONSTANTS.TIMEOFF.CREATE(businessId), data)
    return response.data
  },

  getAll: async (businessId: string, params?: TimeOffApi.GetTimeOffs.QueryParams): Promise<TimeOffApi.GetTimeOffs.Response> => {
    const response = await apiClient.get<TimeOffApi.GetTimeOffs.Response>(APICONSTANTS.TIMEOFF.GET_ALL(businessId), {
      params
    })
    return response.data
  },

  getById: async (businessId: string, id: string): Promise<TimeOffApi.GetTimeOff.Response> => {
    const response = await apiClient.get<TimeOffApi.GetTimeOff.Response>(APICONSTANTS.TIMEOFF.GET_BY_ID(businessId, id))
    return response.data
  },

  update: async (businessId: string, id: string, data: TimeOffApi.UpdateTimeOff.Request): Promise<void> => {
    await apiClient.put(APICONSTANTS.TIMEOFF.UPDATE(businessId, id), data)
  },

  delete: async (businessId: string, id: string): Promise<void> => {
    await apiClient.delete(APICONSTANTS.TIMEOFF.DELETE(businessId, id))
  },

  cancel: async (businessId: string, id: string): Promise<void> => {
    await apiClient.post(APICONSTANTS.TIMEOFF.CANCEL(businessId, id))
  },
}