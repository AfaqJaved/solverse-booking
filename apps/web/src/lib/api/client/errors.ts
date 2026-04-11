export class ApiError extends Error {
	constructor(
		public status: number,
		public errorTag: string,
		public message: string,
		public path: string
	) {
		super(`${status} ${errorTag}: ${message}`)
		this.name = 'ApiError'
	}
}

export const isApiError = (error: unknown): error is ApiError => {
	return error instanceof ApiError
}

export const handleApiError = (error: unknown): never => {
	if (error instanceof ApiError) {
		console.error(`API Error [${error.status}]:`, error.message)
		throw error
	}

	if (error instanceof Error) {
		console.error('Network Error:', error.message)
		throw error
	}

	console.error('Unknown Error:', error)
	throw new Error('An unknown error occurred')
}
