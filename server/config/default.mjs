import dotenv from 'dotenv'
dotenv.config()

export default Object.freeze({
	port: process.env.PORT,
	databaseUrl: process.env.MONGODB_URL,
	databaseName: process.env.DATABASE_NAME,
	mongoURI: `${process.env.MONGODB_URL}${process.env.DATABASE_NAME}`,
	tokenKey: process.env.SECRET_KEY,
	expiredTime: process.env.EXPIRE_PERIOD,
	exchangeRateApiUrl: process.env.EXCHANGE_RATE_API_URL,
})
