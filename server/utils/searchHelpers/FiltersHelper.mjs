import QueryParser from './QueryParser.mjs'

class FiltersHelper {
	// Метод для застосування фільтрів до запиту
	static applyFilters(query, filters) {
		filters.forEach((filter) => {
			switch (filter.filterType) {
				case 'search':
					// Застосовуємо пошуковий фільтр з регулярним виразом
					query.where(filter.fieldName).regex(new RegExp(filter.filterContent, 'i'))
					break
				case 'minValue':
					// Фільтр для мінімального значення
					query.where(filter.fieldName).gte(filter.filterContent)
					break
				case 'maxValue':
					// Фільтр для максимального значення
					query.where(filter.fieldName).lte(filter.filterContent)
					break
				case 'in':
					// Фільтр для значень, що входять у список
					query.where(filter.fieldName).in(filter.filterContent)
					break
				case 'nin':
					// Фільтр для значень, що не входять у список
					query.where(filter.fieldName).nin(filter.filterContent)
					break
				case 'exists':
					// Фільтр для перевірки існування поля
					query.where(filter.fieldName).exists(filter.filterContent)
					break
				// Додайте інші типи фільтрів за потреби
				default:
					console.warn(`Unsupported filter type: ${filter.filterType}`)
			}
		})
		return query
	}

	// Метод для застосування дій до запиту
	static applyActions(query, actions) {
		actions.forEach((action) => {
			switch (action.type) {
				case 'sort':
					// Сортування результатів
					query.sort({ [action.field]: action.order })
					break
				case 'skip':
					// Пропуск певної кількості результатів
					query.skip(action.value)
					break
				case 'limit':
					// Обмеження кількості результатів
					query.limit(action.value)
					break

				default:
					console.warn(`Unsupported action type: ${action.type}`)
			}
		})
		return query
	}

	// Метод для застосування фільтрів та дій з запиту
	static applyFindOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
		const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration)
		if (filters.length) query = this.applyFilters(query, filters)
		if (actions.length) query = this.applyActions(query, actions)
		return query
	}

	// Метод для застосування лише фільтрів з запиту
	static applyFiltersOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
		const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration)
		if (filters.length) query = this.applyFilters(query, filters)
		return query
	}

	// Метод для застосування лише дій з запиту
	static applyActionsOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
		const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration)
		if (actions.length) query = this.applyActions(query, actions)
		return query
	}
}

export default FiltersHelper
