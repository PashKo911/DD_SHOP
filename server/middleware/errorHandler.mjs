const errorHandler = (app) => {
	app.use((req, res, next) => {
		const err = new Error(`Route ${req.method} ${req.originalUrl} not found`)
		err.status = 404
		next(err)
	})

	app.use((err, req, res, next) => {
		logger.warn('Unhandled request', {
			method: req.method,
			url: req.originalUrl,
			status: err.status || 500,
			message: err.message,
			...(req.app.get('env') === 'development' && { stack: err.stack }),
		})

		const payload = {
			error: {
				message: err.message || 'Internal Server Error',
				...(req.app.get('env') === 'development' && { stack: err.stack }),
			},
		}

		res.status(err.status || 500).json(payload)
	})
}

export default errorHandler
