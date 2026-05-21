/**
 * Convert express-validator errors into a simplified array.
 *
 * @param {Object} errorsObj - Result from `validationResult()`.
 * @returns {Array<{field: string, message: string}>} Normalized errors.
 *
 * @example
 *  Input:
 *  { errors: [{ path: "email", msg: "Invalid email" }] }
 *  Output:
 *  [{ field: "email", validationCode: "Invalid email" }]
 */
export function normalizeExpressValidatorErrors(errorsObj) {
	return errorsObj.errors.map((error) => ({
		field: error.path,
		validationCode: error.msg,
	}))
}
