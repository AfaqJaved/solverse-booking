import type { UserApi } from '@solverse/shared'
import { apiClient } from '../client/axios.client'
import { setTokenInMemory, clearTokenFromMemory } from './token.manager'

export const authClient = {
  login: async (credentials: UserApi.Login.Request): Promise<UserApi.Login.Response> => {
    const response = await apiClient.post<UserApi.Login.Response>('/users/login', credentials)
    setTokenInMemory(response.data.token)
    return response.data
  },

  logout: (): void => {
    clearTokenFromMemory()
  },

  verifyEmail: async (userId: string): Promise<void> => {
    await apiClient.post(`/users/${userId}/verify-email`)
  },
}