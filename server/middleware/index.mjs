import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import loggerConfig from '../config/logger.mjs'
import helmet from 'helmet'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const middleware = (app) => {
	app.use(
		helmet({
			crossOriginResourcePolicy: { policy: 'cross-origin' },
			crossOriginEmbedderPolicy: false,
		})
	)

	app.use(cors())

	app.use((req, res, next) => {
		req.__dirname = __dirname
		next()
	})

	// Middleware для логування запитів
	app.use(loggerConfig)

	// Middleware для парсингу JSON запитів
	app.use(express.json({ limit: '10mb' }))

	// Middleware для парсингу URL-кодованих даних
	app.use(express.urlencoded({ extended: false, limit: '10mb' }))

	// Middleware для обробки статичних файлів
	app.use(express.static(path.join(__dirname, '../public')))
}

export default middleware
