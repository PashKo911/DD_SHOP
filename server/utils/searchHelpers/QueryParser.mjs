/**
 * Parses query filters and actions.
 */

class QueryParser {
	/**
	 * range - Parses a range filter.
	 *
	 * @param {string} fieldName - Name of the field the filter applies to.
	 * @param {string|string[]} filterValue - Filter value, which can be:
	 *   - A number (e.g. 10)
	 *   - A dash-separated range (e.g. "10-20")
	 *   - An array of comparison operator objects (e.g. [{gte: 10}, {lte: 20}])
	 * @returns {object[]} Array of filter objects.
	 */
	static range(fieldName, filterValue) {
		const [minValue, maxValue] = filterValue.map(Number)

		const filtersContent = []

		if (!isNaN(minValue)) {
			filtersContent.push({
				fieldName,
				filterType: 'minValue',
				filterContent: minValue,
			})
		}

		if (!isNaN(maxValue)) {
			filtersContent.push({
				fieldName,
				filterType: 'maxValue',
				filterType: 'maxValue',
				filterContent: maxValue,
			})
		}

		return filtersContent
	}

	static list(fieldName, filterValue) {
		return [
			{
				fieldName,
				filterType: 'in',
				filterContent: filterValue.split(','),
			},
		]
	}

	static search(fieldName, filterValue) {
		return [
			{
				fieldName,
				filterType: 'search',
				filterContent: filterValue,
			},
		]
	}

	static filtersParser(fieldsConfigurations, query) {
		const filters = []
		fieldsConfigurations.forEach(({ fieldName, subField, queryParam, filterCategory }) => {
			const fullFieldName = subField ? `${fieldName}.${subField}` : fieldName
			const param = query[queryParam]

			if (param) {
				if (query[queryParam]) filters.push(...this[filterCategory](fullFieldName, query[queryParam]))
			}
		})
		return filters
	}

	static actionsParser(query) {
		const actions = []

		if (query.sort) {
			const [field, order] = query.sort.split(':')
			console.log(order, 'const [field, order] = query.sort.split()')
			actions.push({
				type: 'sort',
				value: {
					[field]: order === 'desc' ? -1 : 1,
					createdAt: -1,
					_id: -1,
				},
			})
		}

		if (query.page && query.perPage) {
			actions.push({
				type: 'skip',
				value: Number(query.page) * Number(query.perPage),
			})

			actions.push({
				type: 'limit',
				value: parseInt(query.perPage),
			})
		}

		return actions
	}

	static parseQuery(query, fieldsConfigurations) {
		const filters = this.filtersParser(fieldsConfigurations, query)
		const actions = this.actionsParser(query)
		return { filters, actions }
	}
}
export default QueryParser
