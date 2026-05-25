import dotenv from 'dotenv'
dotenv.config()

export const isProduction = process.env.NODE_ENV === 'production'

export const config = Object.freeze({
	port: process.env.PORT,
	databaseUrl: process.env.MONGODB_URL,
	databaseName: process.env.DATABASE_NAME,
	mongoURI: `${process.env.MONGODB_URL}${process.env.DATABASE_NAME}`,
	accessTokenKey: process.env.ACCESS_TOKEN_SECRET,
	accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
	refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
	clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
	cookieSecure: isProduction,
	cookieSameSite: isProduction ? 'none' : 'lax',
	exchangeRateApiUrl: process.env.EXCHANGE_RATE_API_URL,
	googleClientId: process.env.GOOGLE_CLIENT_ID,
	googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
	googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
})
