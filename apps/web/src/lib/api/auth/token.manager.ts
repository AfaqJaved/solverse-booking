const REFRESH_TOKEN_KEY = 'refreshToken'

// Access token — memory only (cleared on page refresh)
let accessToken: string | null = null

export const getTokenFromMemory = (): string | null => {
	return accessToken
}

export const setTokenInMemory = (token: string): void => {
	accessToken = token
}

export const clearTokenFromMemory = (): void => {
	accessToken = null
}

export const hasToken = (): boolean => {
	return accessToken !== null
}

// Refresh token — localStorage (survives page refresh)
export const getRefreshToken = (): string | null => {
	return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const setRefreshToken = (token: string): void => {
	localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const clearRefreshToken = (): void => {
	localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const clearAllTokens = (): void => {
	clearTokenFromMemory()
	clearRefreshToken()
}
