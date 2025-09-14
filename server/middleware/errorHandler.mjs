import { normalizeError } from '../utils/errorNormalizers/normalizeError.mjs'

export default function errorHandler(app) {
	app.use((req, res, next) => {
		const err = new Error(`Route ${req.method} ${req.originalUrl} not found`)
		err.status = 404
		err.expose = true
		next(err)
	})

	app.use((err, req, res, next) => {
		const { status, body, logLevel } = normalizeError(err)

		const time = new Date().toISOString()
		const safeMsg = err && err.message ? err.message : String(err)
		const messageForLog = `${time} ${req.method} ${req.originalUrl} → ${status}: ${safeMsg}`

		if (logLevel === 'warn') {
			console.warn('[WARN]', messageForLog)
		} else {
			console.error('[ERROR]', messageForLog)
			if (req.app.get('env') === 'development') {
				console.error(err && err.stack ? err.stack : err)
			}
		}

		res.status(status).json(body)
	})
}
