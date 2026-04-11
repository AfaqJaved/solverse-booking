import type { OnboardingApi } from '@solverse/shared'
import { APICONSTANTS } from '@solverse/shared'
import { apiClient } from '../client/axios.client'

export const onboardingClient = {
	register: async (
		data: OnboardingApi.Register.Request
	): Promise<OnboardingApi.Register.Response> => {
		const response = await apiClient.post<OnboardingApi.Register.Response>(
			APICONSTANTS.ONBOARDING.REGISTER,
			data
		)
		return response.data
	}
}
