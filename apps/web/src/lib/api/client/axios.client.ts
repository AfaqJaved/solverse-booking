import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, ApiErrorResponse } from '@solverse/shared'
import { APICONSTANTS } from '@solverse/shared'
import { ApiError } from './errors'
import { API_CONFIG } from './config'
import {
	getTokenFromMemory,
	setTokenInMemory,
	getRefreshToken,
	clearAllTokens
} from '../auth/token.manager'

// Tracks whether a refresh is already in flight so concurrent 401s
// don't each trigger their own refresh call.
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

const resolvePending = (token: string) => {
	pendingRequests.forEach((resolve) => resolve(token))
	pendingRequests = []
}

// Bare axios instance used only for the refresh call — has no interceptors
// so it won't trigger another refresh on failure.
const refreshClient = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	timeout: API_CONFIG.TIMEOUT,
	headers: { 'Content-Type': 'application/json' }
})

export const createAxiosClient = (baseURL: string): AxiosInstance => {
	const client = axios.create({
		baseURL,
		timeout: API_CONFIG.TIMEOUT,
		headers: {
			'Content-Type': 'application/json'
		}
	})

	// Attach access token to every request
	client.interceptors.request.use((config) => {
		const token = getTokenFromMemory()
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	})

	// Unwrap ApiResponse<T> and handle errors with auto-refresh on 401
	client.interceptors.response.use(
		(response: AxiosResponse<ApiResponse<any>>) => {
			return { ...response, data: response.data.data }
		},
		async (error) => {
			const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

			if (error.response?.status === 401 && !originalRequest._retry) {
				const refreshToken = getRefreshToken()

				if (!refreshToken) {
					clearAllTokens()
					return Promise.reject(error)
				}

				if (isRefreshing) {
					// Queue this request until the ongoing refresh resolves
					return new Promise((resolve) => {
						pendingRequests.push((newToken: string) => {
							originalRequest.headers.Authorization = `Bearer ${newToken}`
							resolve(client(originalRequest))
						})
					})
				}

				originalRequest._retry = true
				isRefreshing = true

				try {
					const { data } = await refreshClient.post<ApiResponse<{ accessToken: string }>>(
						APICONSTANTS.AUTH.REFRESH_TOKEN,
						{ refreshToken }
					)
					const newAccessToken = data.data.accessToken
					setTokenInMemory(newAccessToken)
					resolvePending(newAccessToken)
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
					return client(originalRequest)
				} catch {
					clearAllTokens()
					pendingRequests = []
					return Promise.reject(error)
				} finally {
					isRefreshing = false
				}
			}

			if (error.response?.data) {
				const apiError = error.response.data as ApiErrorResponse
				console.error(`API Error [${apiError.statusCode}]:`, apiError.message)
				throw new ApiError(apiError.statusCode, apiError.errorTag, apiError.message, apiError.path)
			}

			if (error.code === 'ECONNABORTED') {
				console.error('Request timeout:', error.message)
				throw new Error('Request timeout. Please try again.')
			}

			if (error.message === 'Network Error') {
				console.error('Network error:', error.message)
				throw new Error('Network error. Please check your connection.')
			}

			console.error('Unknown error:', error.message)
			throw error
		}
	)

	return client
}

// Create default client instance
export const apiClient = createAxiosClient(API_CONFIG.BASE_URL)
