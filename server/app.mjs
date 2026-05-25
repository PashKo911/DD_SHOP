import express from 'express'
import cron from 'node-cron'
import routes from './src/v1/routes/index.mjs'
import connectDB from './db/connectDB.mjs'
import middleware from './middleware/index.mjs'
import errorHandler from './middleware/errorHandler.mjs'
import { refreshRates } from './services/ratesCache.mjs'

const app = express()

connectDB()
middleware(app)
app.use('/api/v1/', routes)

cron.schedule('0 0 * * *', refreshRates)

errorHandler(app)

export default app
