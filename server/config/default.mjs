import dotenv from 'dotenv'
dotenv.config()

export default Object.freeze({
	databaseName: process.env.DATABASE_NAME,
	databaseUrl: process.env.MONGODB_URL,
	mongoURI: `${process.env.MONGODB_URL}${process.env.DATABASE_NAME}`,
	port: process.env.PORT,
	tokenKey: process.env.TOKEN_KEY,
	expiredTime: process.env.EXPIRE_PERIOD,
})
