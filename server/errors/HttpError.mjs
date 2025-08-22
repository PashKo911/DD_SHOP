export class HttpError extends Error {
	constructor(status, message, cause) {
		super(message)
		this.status = status

		if (cause) {
			const causeStack = cause.stack || cause.toString()
			this.stack = `${this.stack}\n\nCaused by: ${causeStack}`
		}
	}
}
