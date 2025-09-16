import { errorCodes } from './errorCodes'

const supportedAuthErrorCodes = [
	errorCodes.DUPLICATE_KEY,
	errorCodes.VALIDATION_ERROR,
	errorCodes.AUTH_METHOD_NOT_SUPPORTED,
	errorCodes.UNAUTHORIZED,
]

export default supportedAuthErrorCodes
