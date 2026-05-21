import QueryParser from './QueryParser.mjs'
import { appConstants } from '../../constants/app.mjs'

/**
 * Helper for applying query filters and actions.
 */

class FiltersHelper {
	static applyFilters(query, filters) {
		filters.forEach((filter) => {
			switch (filter.filterType) {
				case 'search':
					const regex = new RegExp(filter.filterContent, 'i')
					const conditions = appConstants.supportedLanguages.map((l) => ({
						[`${filter.fieldName}.${l}`]: regex,
					}))

					query.or(conditions)
					break
				case 'minValue':
					query.where(filter.fieldName).gte(filter.filterContent)
					break
				case 'maxValue':
					query.where(filter.fieldName).lte(filter.filterContent)
					break
				case 'in':
					query.where(filter.fieldName).in(filter.filterContent)
					break
				case 'nin':
					query.where(filter.fieldName).nin(filter.filterContent)
					break
				case 'exists':
					query.where(filter.fieldName).exists(filter.filterContent)
					break
				default:
					console.warn(`Unsupported filter type: ${filter.filterType}`)
			}
		})

		return query
	}

	static applyActions(query, actions) {
		actions.forEach((action) => {
			switch (action.type) {
				case 'sort':
					query.sort({ [action.field]: action.order })
					break
				case 'skip':
					query.skip(action.value)
					break
				case 'limit':
					query.limit(action.value)
					break

				default:
					console.warn(`Unsupported action type: ${action.type}`)
			}
		})
		return query
	}

	static applyFindOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
		const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration)
		if (filters.length) query = this.applyFilters(query, filters)
		if (actions.length) query = this.applyActions(query, actions)
		return query
	}

	static applyFiltersOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
		const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration)
		if (filters.length) query = this.applyFilters(query, filters)
		return query
	}

	static applyActionsOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
		const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration)
		if (actions.length) query = this.applyActions(query, actions)
		return query
	}
}

export default FiltersHelper
