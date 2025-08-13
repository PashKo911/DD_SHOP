import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGeneralStore } from './general'

import apiClient from '@/config/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'

export const useReviewsStore = defineStore('reviews', () => {
	const limit = 10
	const minRating = 4
	const generalStore = useGeneralStore()

	const { isLoading, generalApiOperation, hasError } = generalStore
	const reviews = ref([])
	//========================================================================================================================================================

	const reviewsValue = computed(() => {
		return reviews.value
	})

	const isReviewsLoading = computed(() => {
		return isLoading('reviews')
	})

	const hasReviewsError = computed(() => {
		return Boolean(hasError('reviews'))
	})
	//========================================================================================================================================================

	const getReviews = async () => {
		const response = await generalApiOperation({
			operationName: 'reviews',
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

		// status
		isReviewsLoading,
		hasReviewsError,

		// actions
		getReviews,
	}
})
