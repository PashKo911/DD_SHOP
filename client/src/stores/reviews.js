import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGeneralStore } from './general'

import apiClient from '@/api/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'

export const useReviewsStore = defineStore('reviews', () => {
	const limit = 10
	const minRating = 4
	const generalStore = useGeneralStore()

	const { isLoading, generalApiOperation } = generalStore
	const reviews = ref([])
	//========================================================================================================================================================

	const reviewsValue = computed(() => {
		return reviews.value
	})

	const isReviewsLoading = computed(() => {
		return isLoading('getReviews')
	})
	//========================================================================================================================================================

	const getReviews = async () => {
		const response = await generalApiOperation({
			operationName: 'getReviews',
			operation: async () => {
				const response = await apiClient(
					apiEndpoints.reviews.getRandomReviews,
					{
						params: {
							limit,
							minRating,
						},
					},
				)
				return response
			},
		})
		reviews.value = response?.data?.reviews ?? []
	}
	return {
		// refs
		reviews,

		// computed
		reviewsValue,
		isReviewsLoading,

		// actions
		getReviews,
	}
})
