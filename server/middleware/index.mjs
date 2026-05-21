import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import appLogger from '../logger/appLogger.mjs'
import helmet from 'helmet'
import { config } from '../config/default.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const middleware = (app) => {
	app.use(
		helmet({
			crossOriginResourcePolicy: { policy: 'cross-origin' },
			crossOriginEmbedderPolicy: false,
		})
	)

	app.use(
		cors({
			origin: config.clientOrigin,
			credentials: true,
		})
	)

	app.use(cookieParser())

	app.use((req, res, next) => {
		req.__dirname = __dirname
		next()
	})

	app.use(appLogger)

	app.use(express.json({ limit: '10mb' }))

	app.use(express.urlencoded({ extended: false, limit: '10mb' }))

	app.use(express.static(path.join(__dirname, '../public')))
}

export default middleware
