// Memory-only token storage
let authToken: string | null = null

export const getTokenFromMemory = (): string | null => {
	return authToken
}

export const setTokenInMemory = (token: string): void => {
	authToken = token
	console.log('Token stored in memory')
}

export const clearTokenFromMemory = (): void => {
	authToken = null
	console.log('Token cleared from memory')
}

export const hasToken = (): boolean => {
	return authToken !== null
}
