import type { UserApi } from '@solverse/shared'
import { apiClient } from '../client/axios.client'

export const userClient = {
  register: async (data: UserApi.Register.Request): Promise<UserApi.Register.Response> => {
    const response = await apiClient.post<UserApi.Register.Response>('/users/register', data)
    return response.data
  },

  getProfile: async (userId: string): Promise<UserApi.GetUser.Response> => {
    const response = await apiClient.get<UserApi.GetUser.Response>(`/users/${userId}`)
    return response.data
  },

  updateProfile: async (userId: string, data: UserApi.UpdateProfile.Request): Promise<void> => {
    await apiClient.patch(`/users/${userId}/profile`, data)
  },

  changeEmail: async (userId: string, data: UserApi.ChangeEmail.Request): Promise<void> => {
    await apiClient.patch(`/users/${userId}/email`, data)
  },

  deactivate: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}`)
  },

  reactivate: async (userId: string): Promise<void> => {
    await apiClient.patch(`/users/${userId}/reactivate`)
  },

  suspend: async (userId: string, data: UserApi.SuspendUser.Request): Promise<void> => {
    await apiClient.patch(`/users/${userId}/suspend`, data)
  },
}