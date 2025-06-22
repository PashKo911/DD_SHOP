import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

import viewModeData from '@/data/viewModeData'

export const useCommonStore = defineStore('commonStore', () => {
	const viewMode = ref(viewModeData[0])
	const isHeaderMenuOpen = ref(false)
	//========================================================================================================================================================

	const viewModeValue = computed(() => {
		return viewMode.value
	})

	const currentProductsPerPageByViewMode = computed(() => {
		return viewMode.value.value * 3
	})
	//========================================================================================================================================================

	const setViewMode = (mode) => {
		viewMode.value = mode
	}

	const toggleHeaderMenu = () => {
		isHeaderMenuOpen.value = !isHeaderMenuOpen.value
	}

	return {
		isHeaderMenuOpen,
		toggleHeaderMenu,
		viewMode,
		setViewMode,
		viewModeValue,
		currentProductsPerPageByViewMode,
	}
})
