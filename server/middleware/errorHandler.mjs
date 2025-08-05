export default function errorHandler(app) {
	app.use((req, res, next) => {
		const err = new Error(`Route ${req.method} ${req.originalUrl} not found`)
		err.status = 404
		next(err)
	})

	app.use((err, req, res, next) => {
		const status = err.status || 500
		const payload = {
			error: {
				message: err.message || 'Internal Server Error',
				...(req.app.get('env') === 'development' && { stack: err.stack }),
			},
		}

		if (status === 404) {
			console.warn(
				`[WARN] ${new Date().toISOString()} ${req.method} ${req.originalUrl} → ${status}: ${err.message}`
			)
		} else {
			console.error(
				`[ERROR] ${new Date().toISOString()} ${req.method} ${req.originalUrl} → ${status}: ${err.message}`
			)
			if (req.app.get('env') === 'development') {
				console.error(err.stack)
			}
		}

		res.status(status).json(payload)
	})
}
