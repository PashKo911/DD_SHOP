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

		let messageForLog = `${time} ${req.method} ${req.originalUrl} → ${status}: ${safeMsg}`

		if (err.cause) {
			messageForLog += `\n +++ Cause: ${
				err.cause instanceof Error ? err.cause.stack || err.cause.message : JSON.stringify(err.cause)
			}`
		}

		if (logLevel === 'warn') {
			console.warn('[WARN]', messageForLog)
		} else {
			console.error('[ERROR]', messageForLog)
			if (req.app.get('env') === 'development') {
				console.error('Stack:', err.stack)
				if (err.cause) {
					console.error('Cause stack:', err.cause instanceof Error ? err.cause.stack : err.cause)
				}
			}
		}

		res.status(status).json(body)
	})
}
