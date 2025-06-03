import { defineStore } from 'pinia'
import { useGeneralStore } from './general'
import { useFilterStore } from './filter'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import apiClient from '@/api/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'
import { computed, ref } from 'vue'

export const useProductsStore = defineStore('products', () => {
	const generalStore = useGeneralStore()
	const filterStore = useFilterStore()
	const { locale, t } = useI18n()

	const { generalApiOperation, isLoading } = generalStore
	const { apiQueryParams } = storeToRefs(filterStore)

	const products = ref([])
	const suggestions = ref([])
	const count = ref(null)

	const productsValue = computed(() => {
		return products.value
	})

	const suggestionsValue = computed(() => {
		const grouped = suggestions.value.reduce((acc, s) => {
			const genderKey = s.gender.label[locale.value]

			if (!acc[genderKey]) {
				acc[genderKey] = []
			}

			acc[genderKey].push(s)
			return acc
		}, {})

		const res = Object.entries(grouped).map(([label, arr]) => ({
			label,
			items: arr.map((i) => ({
				label: i.title,
				categoryId: i.gender._id,
			})),
		}))
		return res
	})
	// const suggestionsValue = computed(() => {
	// 	const res = suggestions.value.map((s) => ({
	// 		title: s.title,
	// 		formattedTitle: t('partials.mainSearchInput.suggestionTitle', {
	// 			title: s.title,
	// 			gender: s.gender.label[locale.value],
	// 		}),
	// 	}))
	// 	return res
	// })
	const isSuggestionsLoading = computed(() => {
		return isLoading('getSuggestions')
	})

	const getProducts = async () => {
		const { data } = await generalApiOperation({
			operationName: 'getProducts',
			operation: async () => {
				const response = await apiClient(apiEndpoints.products.getProducts, {
					params: apiQueryParams.value,
				})
				return response.data
			},
		})

		count.value = data.count
		products.value = data.documents
	}
	const getSuggestions = async (querySearch) => {
		const queryParams = {
			...apiQueryParams.value,
			perPage: 5,
			title: querySearch,
		}
		const { data } = await generalApiOperation({
			operationName: 'getSuggestions',
			operation: async () => {
				const response = await apiClient(apiEndpoints.products.getSuggestions, {
					params: queryParams,
				})
				return response.data
			},
		})
		suggestions.value = data
	}

	return {
		products,
		productsValue,
		getProducts,
		suggestions,
		suggestionsValue,
		getSuggestions,
		count,
		isSuggestionsLoading,
	}
})
