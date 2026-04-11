import type { UserApi } from '@solverse/shared'
import { APICONSTANTS } from '@solverse/shared'
import { apiClient } from '../client/axios.client'

export const userClient = {
	register: async (data: UserApi.Register.Request): Promise<UserApi.Register.Response> => {
		const response = await apiClient.post<UserApi.Register.Response>(
			APICONSTANTS.USERS.REGISTER,
			data
		)
		return response.data
	},

	getProfile: async (userId: string): Promise<UserApi.GetUser.Response> => {
		const response = await apiClient.get<UserApi.GetUser.Response>(
			APICONSTANTS.USERS.GET_BY_ID(userId)
		)
		return response.data
	},

	updateProfile: async (userId: string, data: UserApi.UpdateProfile.Request): Promise<void> => {
		await apiClient.patch(APICONSTANTS.USERS.UPDATE_PROFILE(userId), data)
	},

	changeEmail: async (userId: string, data: UserApi.ChangeEmail.Request): Promise<void> => {
		await apiClient.patch(APICONSTANTS.USERS.CHANGE_EMAIL(userId), data)
	},

	deactivate: async (userId: string): Promise<void> => {
		await apiClient.delete(APICONSTANTS.USERS.DEACTIVATE(userId))
	},

	reactivate: async (userId: string): Promise<void> => {
		await apiClient.patch(APICONSTANTS.USERS.REACTIVATE(userId))
	},

	suspend: async (userId: string, data: UserApi.SuspendUser.Request): Promise<void> => {
		await apiClient.patch(APICONSTANTS.USERS.SUSPEND(userId), data)
	}
}
