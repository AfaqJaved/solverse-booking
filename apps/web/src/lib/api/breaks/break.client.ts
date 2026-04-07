import type { BreakApi } from '@solverse/shared'
import { APICONSTANTS } from '@solverse/shared'
import { apiClient } from '../client/axios.client'

export const breakClient = {
  create: async (data: BreakApi.Create.Request): Promise<BreakApi.Create.Response> => {
    const response = await apiClient.post<BreakApi.Create.Response>(APICONSTANTS.BREAKS.CREATE, data)
    return response.data
  },

  getById: async (id: string): Promise<BreakApi.GetBreak.Response> => {
    const response = await apiClient.get<BreakApi.GetBreak.Response>(APICONSTANTS.BREAKS.GET_BY_ID(id))
    return response.data
  },

  getByWorkingHours: async (workingHoursId: string): Promise<BreakApi.GetBreaksByWorkingHours.Response> => {
    const response = await apiClient.get<BreakApi.GetBreaksByWorkingHours.Response>(APICONSTANTS.BREAKS.GET_BY_WORKING_HOURS, {
      params: { workingHoursId }
    })
    return response.data
  },

  updateTimes: async (id: string, data: BreakApi.UpdateTimes.Request): Promise<void> => {
    await apiClient.patch(APICONSTANTS.BREAKS.UPDATE_TIMES(id), data)
  },

  delete: async (id: string, data: BreakApi.Delete.Request): Promise<void> => {
    await apiClient.delete(APICONSTANTS.BREAKS.DELETE(id), { data })
  },
}