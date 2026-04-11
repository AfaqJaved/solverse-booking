import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ApiResponse, ApiErrorResponse } from '@solverse/shared'
import { ApiError } from './errors'
import { API_CONFIG } from './config'
import { getTokenFromMemory } from '../auth/token.manager'

export const createAxiosClient = (baseURL: string): AxiosInstance => {
	const client = axios.create({
		baseURL,
		timeout: API_CONFIG.TIMEOUT,
		headers: {
			'Content-Type': 'application/json'
		}
	})

	// Request interceptor for auth token
	client.interceptors.request.use((config) => {
		const token = getTokenFromMemory()
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	})

	// Response interceptor for error handling and response unwrapping
	client.interceptors.response.use(
		(response: AxiosResponse<ApiResponse<any>>) => {
			// Unwrap ApiResponse<T> to return just the data
			return { ...response, data: response.data.data }
		},
		(error) => {
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
