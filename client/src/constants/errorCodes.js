export const errorCodes = Object.freeze({
	// Client errors (4xx)
	VALIDATION_ERROR: 'VALIDATION_ERROR', // Validation error for input fields (e.g. invalid email/password)
	AUTH_METHOD_NOT_SUPPORTED: 'AUTH_METHOD_NOT_SUPPORTED', // Account does not support the requested authentication method (e.g. account created via Google — password sign-in is not allowed). Use with 400 Bad Request and a validation detail like { field: 'form', validationCode: validationErrorCodes.UNSUPPORTED_AUTH_METHOD } so frontend can show appropriate UI (e.g. "Sign in with Google").
	BAD_REQUEST: 'BAD_REQUEST', // General bad request (malformed or invalid parameters)
	UNAUTHORIZED: 'UNAUTHORIZED', // Not authenticated / authentication token required
	FORBIDDEN: 'FORBIDDEN', // Authenticated but not permitted to perform the action
	NOT_FOUND: 'NOT_FOUND', // Resource not found
	CONFLICT: 'CONFLICT', // Conflict with current state (e.g. duplicate resource)
	DUPLICATE_KEY: 'DUPLICATE_KEY', // Duplicate key error from database (e.g. unique field already exists)
	PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE', // Request body or uploaded file is too large
	UNSUPPORTED_MEDIA: 'UNSUPPORTED_MEDIA', // Uploaded media type is not supported
	RATE_LIMITED: 'RATE_LIMITED', // Request rate limit exceeded (throttling)

	// Server errors (5xx)
	INTERNAL_ERROR: 'INTERNAL_ERROR', // General internal server error. Use for unexpected exceptions.
	SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE', // Service temporarily unavailable (external dependency down).
	TIMEOUT: 'TIMEOUT', // Operation timeout (DB/external API took too long).
	DATABASE_ERROR: 'DATABASE_ERROR', // Database related error.

	// Business / domain errors (custom)
	EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS', // Email already registered
	USER_BLOCKED: 'USER_BLOCKED', // User account is blocked
	PASSWORD_EXPIRED: 'PASSWORD_EXPIRED', // Password expired, requires change
	INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS', // Not enough balance for operation

	// OAuth / OIDC errors
	OAUTH_ERROR: 'OAUTH_ERROR', // Generic OAuth error
	OAUTH_HTTP_ERROR: 'OAUTH_HTTP_ERROR', // HTTP error during OAuth request
	OAUTH_VALIDATION_ERROR: 'OAUTH_VALIDATION_ERROR', // Invalid/missing OAuth parameters
	OAUTH_TOKEN_ERROR: 'OAUTH_TOKEN_ERROR', // Error while exchanging code for token
	OAUTH_ID_TOKEN_ERROR: 'OAUTH_ID_TOKEN_ERROR', // ID Token validation failed
	OAUTH_UNKNOWN_ERROR: 'OAUTH_UNKNOWN_ERROR', // Catch-all for unexpected OAuth errors
})
