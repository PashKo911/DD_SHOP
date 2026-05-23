/**
 * Build an i18n translation key from a server error node.
 * @param {Object|null} node - Server error node (e.g. { validationCode: 'invalid' }).
 * @param {string} [root='errors'] - Translation root (e.g. 'errors.email').
 * @returns {string|null}
 */
export function buildErrorKey(node, root = 'errors') {
	if (!node) return null
	const code = node?.validationCode
	return code ? `${root}.${code}` : null
}
