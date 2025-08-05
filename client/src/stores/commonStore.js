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

	//========================================================================================================================================================

	const setViewMode = (mode) => {
		viewMode.value = mode
	}

	const toggleHeaderMenu = () => {
		isHeaderMenuOpen.value = !isHeaderMenuOpen.value
	}

	return {
		// refs
		isHeaderMenuOpen,
		viewMode,

		// computed
		viewModeValue,

		// actions
		toggleHeaderMenu,
		setViewMode,
	}
})
