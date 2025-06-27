<template>
	<div class="search-input relative z-20 order-3 min-w-[8.125rem] grow">
		<auto-complete
			v-model="localState"
			optionLabel="label"
			optionGroupLabel="label"
			optionGroupChildren="items"
			fluid
			dropdown
			scrollHeight="20rem"
			:tabindex="1"
			:suggestions="suggestionsValue"
			:loading="isSuggestionsLoading"
			:emptySearchMessage="t('partials.emptySearchMessage')"
			@complete="onSearch"
			@option-select="applySearchFilter"
			@clear="onClear"
		>
			<template #dropdownicon>
				<search-icon
					class="fill-primary transition-transform duration-300 hover:scale-125"
				/>
			</template>
		</auto-complete>

		<button
			type="button"
			v-show="isClearButtonVisible"
			:tabindex="activeTabIndex"
			@click="onClear"
			class="group focus-visible:border-t-inverse-hover absolute top-1/2 right-0 z-50 grid h-full w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-r-md border-2 border-transparent transition-colors duration-200 outline-none"
		>
			<close-icon
				class="fill-primary h-full w-4 transition-colors duration-300 group-hover:fill-red-400 group-focus-visible:fill-red-400"
			/>
		</button>
	</div>
</template>

<script setup>
import { useFilterStore } from '@/stores/filter'
import { useProductsStore } from '@/stores/products'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import AutoComplete from '../ui/autocomplete/AutoComplete.vue'
import CloseIcon from '../icons/CloseIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
//========================================================================================================================================================

const filterStore = useFilterStore()
const productStore = useProductsStore()

const router = useRouter()
const route = useRoute()

const { filter } = storeToRefs(filterStore)
const { setFilterProp } = filterStore

const { suggestionsValue, isSuggestionsLoading } = storeToRefs(productStore)
const { getSuggestions } = productStore

const { t } = useI18n()

const localState = ref(null)
//========================================================================================================================================================

const isClearButtonVisible = computed(() => {
	return !isSuggestionsLoading.value && localState.value
})
const activeTabIndex = computed(() => {
	return isClearButtonVisible.value ? 2 : -1
})
//========================================================================================================================================================

const onSearch = async ({ query }) => {
	await getSuggestions(query)
}

const applySearchFilter = ({ value }) => {
	setFilterProp('gender', value.genderId)
	setFilterProp('title', value.label)

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
//========================================================================================================================================================

watch(
	() => filter.value.title,
	(newVal) => {
		localState.value = newVal
	},
)
</script>
