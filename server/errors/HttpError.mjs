export class HttpError extends Error {
	constructor(status, message, cause) {
		super(message)
		this.status = status
		if (cause) this.cause = cause
		Error.captureStackTrace(this, this.constructor)
	}
}
