<template>
	<div class="search-input relative z-[200] order-3 min-w-[8.125rem] grow">
		<auto-complete
			v-model="localState"
			optionLabel="label"
			optionGroupLabel="label"
			optionGroupChildren="items"
			:tabindex="1"
			:suggestions="suggestionsValue"
			:loading="isSuggestionsLoading"
			@complete="onSearch"
			@option-select="applySearchFilter"
			@clear="onClear"
			@before-show="onShow"
			@before-hide="onHide"
			fluid
			dropdown
		/>
		<close-icon
			v-show="isClearButtonVisible"
			@click="onClear"
			class="fill-primary absolute top-1/2 right-4 z-50 h-full -translate-y-1/2 cursor-pointer transition-colors duration-300 hover:fill-red-400"
		/>
	</div>
</template>

<script setup>
import { useFilterStore } from '@/stores/filter'
import { useProductsStore } from '@/stores/products'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import AutoComplete from '../ui/autocomplete/AutoComplete.vue'
import CloseIcon from '../icons/CloseIcon.vue'
//========================================================================================================================================================

const filterStore = useFilterStore()
const productStore = useProductsStore()

const router = useRouter()
const route = useRoute()

const { filter } = storeToRefs(filterStore)
const { setFilterProp } = filterStore

const { suggestionsValue, isSuggestionsLoading } = storeToRefs(productStore)
const { getSuggestions } = productStore

const localState = ref(null)
//========================================================================================================================================================

const isClearButtonVisible = computed(() => {
	return !isSuggestionsLoading.value && localState.value
})
//========================================================================================================================================================

const onSearch = async ({ query }) => {
	await getSuggestions(query)
}

const applySearchFilter = ({ value }) => {
	setFilterProp('title', value.label.trim().toLowerCase())
	setFilterProp('gender', value.genderId)

	if (route.name !== 'shopCategory') {
		router.push({
			name: 'shopCategory',
			params: { category: value.genderName },
		})
	}
}

const onClear = () => {
	if (filter.value.title) {
		setFilterProp('title', '')
	} else {
		localState.value = ''
	}
}

const onShow = () => {
	document.documentElement.classList.add('overlay-active')
}

const onHide = () => {
	document.documentElement.classList.remove('overlay-active')
}
//========================================================================================================================================================

watch(
	() => filter.value.title,
	(newVal) => {
		localState.value = newVal
	},
)
</script>
