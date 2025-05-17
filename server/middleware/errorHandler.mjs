const errorHandler = (app) => {
	app.use((req, res, next) => {
		const err = new Error('Not Found')
		err.status = 404
		next(err)
	})

	app.use((err, req, res, next) => {
		res.locals.message = err.message
		res.locals.error = req.app.get('env') === 'development' ? err : {}
		console.log(`⚠️  Unhandled request: ${req.method} ${req.originalUrl}`)
		res.status(err.status || 500)
		console.error(err)
	})
}

export default errorHandler
