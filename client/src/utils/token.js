let accessToken = null

export function getAccessToken() {
	return accessToken
}

export function setTokens({ accessToken: token }) {
	accessToken = token ?? null
}

export function clearTokens() {
	accessToken = null
}
