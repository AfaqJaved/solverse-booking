import type { UserApi } from '@solverse/shared'
import { APICONSTANTS } from '@solverse/shared'
import { apiClient } from '../client/axios.client'
import { setTokenInMemory, setRefreshToken, clearAllTokens } from './token.manager'

export const authClient = {
	login: async (credentials: UserApi.Login.Request): Promise<UserApi.Login.Response> => {
		const response = await apiClient.post<UserApi.Login.Response>(
			APICONSTANTS.AUTH.LOGIN,
			credentials
		)
		setTokenInMemory(response.data.accessToken)
		setRefreshToken(response.data.refreshToken)
		return response.data
	},

	logout: (): void => {
		clearAllTokens()
	},

	verifyEmail: async (userId: string): Promise<void> => {
		await apiClient.post(APICONSTANTS.AUTH.VERIFY_EMAIL(userId))
	}
}
