import dotenv from 'dotenv'
dotenv.config()

export const config = Object.freeze({
	port: process.env.PORT,
	databaseUrl: process.env.MONGODB_URL,
	databaseName: process.env.DATABASE_NAME,
	mongoURI: `${process.env.MONGODB_URL}${process.env.DATABASE_NAME}`,
	tokenKey: process.env.JWT_SECRET,
	expiredTime: process.env.EXPIRE_PERIOD,
	exchangeRateApiUrl: process.env.EXCHANGE_RATE_API_URL,
	googleClientId: process.env.GOOGLE_CLIENT_ID,
	googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
	googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
})
