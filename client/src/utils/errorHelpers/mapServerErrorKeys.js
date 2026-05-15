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

/**
 * Map server errors to i18n keys; omit fields that map to null/undefined.
 * Copies errorsObj.general (if string) into result under `generalFieldName`.
 *
 * @param {Object|null} errorsObj
 * @param {Object} translationPaths - { fieldName: 'translation.root', ... }
 * @param {Object} [opts] - { generalFieldName = 'general' }
 * @returns {Object} - only non-null fields
 */
export function mapServerErrorKeys(
	errorsObj,
	translationPaths = {},
	opts = {},
) {
	const { generalFieldName = 'general' } = opts

	const mapped = Object.entries(translationPaths).reduce(
		(acc, [field, rootPath]) => {
			const node = errorsObj?.[field]
			const value = buildErrorKey(node, rootPath)
			if (value) acc[field] = value
			return acc
		},
		{},
	)

	const general = errorsObj?.general
	if (typeof general === 'string' && general.length) {
		mapped[generalFieldName] = general
	}

	return mapped
}
