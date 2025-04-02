class QueryParser {
	/**
	 * range - Парсить фільтр діапазону значень.
	 *
	 * @param {string} fieldName - Назва поля, для якого застосовується цей фільтр.
	 * @param {string|string[]} filterValue - Значення фільтра, яке може мати такі формати:
	 *   - Число (наприклад, 10)
	 *   - Діапазон, розділений дефісом (наприклад, "10-20")
	 *   - Масив об'єктів з операторами порівняння (наприклад, [{gte: 10}, {lte: 20}])
	 * @returns {object[]} - Масив об'єктів фільтрів.
	 */
	static range(fieldName, filterValue) {
		const [minValue, maxValue] = filterValue.split(',').map(Number)

		const filtersContent = []

		// Якщо мінімальне значення не NaN (число), додає його до масиву фільтрів
		if (!isNaN(minValue)) {
			filtersContent.push({
				fieldName,
				filterType: 'minValue',
				filterContent: minValue,
			})
		}

		// Якщо максимальне значення не NaN (число), додає його до масиву фільтрів
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

	//Парсить фільтр списку значень (розділених комою).
	static list(fieldName, filterValue) {
		return [
			{
				fieldName,
				filterType: 'in',
				filterContent: filterValue.split(','),
			},
		]
	}

	//Парсить фільтр значення для пошуку
	static search(fieldName, filterValue) {
		return [
			{
				fieldName,
				filterType: 'search',
				filterContent: filterValue,
			},
		]
	}

	//------- парсимо всі фільтри ---------
	static filtersParser(fieldsConfigurations, query) {
		const filters = []
		fieldsConfigurations.forEach(({ fieldName, filterCategory }) => {
			if (query[fieldName]) filters.push(...this[filterCategory](fieldName, query[fieldName]))
		})
		return filters
	}

	//------- парсимо всі дії (сортування, пагінація) ---------
	static actionsParser(query) {
		const actions = []
		if (query.sort) {
			const [field, order] = query.sort.split(':')
			actions.push({ type: 'sort', field, order: order === 'desc' ? -1 : 1 })
		}
		if (query.page && query.perPage) {
			actions.push({ type: 'skip', value: query.page * query.perPage })
			actions.push({ type: 'limit', value: parseInt(query.perPage) })
		}

		return actions
	}

	//Загальний метод парсинга усіх параметрів
	static parseQuery(query, fieldsConfigurations) {
		const filters = this.filtersParser(fieldsConfigurations, query)
		const actions = this.actionsParser(query)
		return { filters, actions }
	}
}
export default QueryParser

// ------------------ приклад параметрів ---------------------
// const fieldsConfig = [
//   { fieldName: 'price', filterCategory: 'range' },
//   { fieldName: 'category', filterCategory: 'list' },
//   { fieldName: 'name', filterCategory: 'search' },
// ];

// const query = {
//   price: '10-20',
//   category: 'electronics,books',
//   name: 'iphone',
//   sort: 'price:desc',
//   page: 2,
//   perPage: 10,
// };
