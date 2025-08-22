/**
 * Generates a new array of field configurations with language-specific substitutions.
 *
 * This function takes a base configuration array and a language code, then
 * replaces any placeholder `{lang}` within the `subField` property of each
 * configuration object with the provided language value.
 *
 * @param {Array<Object>} baseConfig
 *   - An array of configuration objects. Each object may contain a `subField`
 *     property, which can include the placeholder string `{lang}`.
 *
 * @param {string} language
 *   - A language code (e.g., `"en"`, `"uk"`, `"fr"`). Used to replace the
 *     `{lang}` placeholder in the `subField` property.
 *
 * @returns {Array<Object>}
 *   - A new array of configuration objects. For each object, if `subField`
 *     was present, the `{lang}` placeholder will be replaced with the given
 *     language. Otherwise, `subField` will be set to `null`.
 **/

export function createFieldsConfigurations(baseConfig, language) {
	return baseConfig.map((cfg) => {
		const subField = cfg.subField ? cfg.subField.replace('{lang}', language) : null
		return { ...cfg, subField }
	})
}
