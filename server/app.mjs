import express from 'express'
import cron from 'node-cron'
import routes from './src/v1/routes/index.mjs'
import connectDB from './db/connectDB.mjs'
import middleware from './middleware/index.mjs'
import errorHandler from './middleware/errorHandler.mjs'
import { refreshRates } from './services/ratesCache.mjs'

const app = express()

//підключення бази даних
connectDB()
// Використання допоміжних middleware
middleware(app)
//підключення роутів
app.use('/api/v1/', routes)

// Оновлення курсу валют за розкладом, один раз на добу о 00.00
cron.schedule('0 0 * * *', refreshRates)

//обробка помилок
errorHandler(app)

export default app
