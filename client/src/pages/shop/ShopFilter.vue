<template>
	<div class="border-border-color rounded-2xl border bg-white p-9">
		<div
			class="border-border-color flex items-center justify-between gap-8 border-b pb-8"
		>
			<h2 class="font-heading text-32-26 leading-tight font-bold">
				{{ t('pages.shop.filter.title') }}
			</h2>
			<filter-icon />
		</div>
		<accordion :value="['0', '1', '2', '3']" multiple>
			<accordion-panel value="0">
				<accordion-header>
					{{ t('pages.shop.filter.sectionsTitles.style') }}
				</accordion-header>
				<accordion-content>
					<style-radio-group
						multiple
						v-model="filter.style"
						:items="dressStyleItems"
					/>
				</accordion-content>
			</accordion-panel>
			<accordion-panel value="1">
				<accordion-header>
					{{ t('pages.shop.filter.sectionsTitles.price') }}
				</accordion-header>
				<accordion-content>
					<slider-price
						v-model="filter.price"
						:min="minPriceExchanged"
						:max="maxPriceExchanged"
						@slideend="onSlideEnd"
					/>
				</accordion-content>
			</accordion-panel>
			<accordion-panel value="2">
				<accordion-header>
					{{ t('pages.shop.filter.sectionsTitles.color') }}
				</accordion-header>
				<accordion-content>
					<color-radio-group
						v-model="filter.color"
						:items="availableColors"
						multiple
					/>
				</accordion-content>
			</accordion-panel>
			<accordion-panel value="3">
				<accordion-header>
					{{ t('pages.shop.filter.sectionsTitles.size') }}
				</accordion-header>
				<accordion-content>
					<size-radio-group
						v-model="filter.size"
						:items="availableSizes"
						multiple
					/>
				</accordion-content>
			</accordion-panel>
		</accordion>
		{{ allOptions }}
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import exchangeRates from '@/locales/exchangeRates'
import { useFacetOptionsStore } from '@/stores/facetOptions'

import { useFilterStore } from '@/stores/filter'

import dressStyleItems from '@/data/dressStyleItems'
import availableColors from '@/data/availableColors'
import availableSizes from '@/data/availableSizes'

import FilterIcon from '@/components/icons/FilterIcon.vue'
import Accordion from '@/components/accordion/Accordion.vue'
import AccordionPanel from '@/components/accordion/AccordionPanel.vue'
import AccordionHeader from '@/components/accordion/AccordionHeader.vue'
import AccordionContent from '@/components/accordion/AccordionContent.vue'
import StyleRadioGroup from '@/components/formControls/StyleRadioGroup.vue'
import SliderPrice from '@/components/formControls/SliderPrice.vue'
import ColorRadioGroup from '@/components/formControls/ColorRadioGroup.vue'
import SizeRadioGroup from '@/components/formControls/SizeRadioGroup.vue'

const { t, numberFormats, locale } = useI18n()

const route = useRoute()
const router = useRouter()

const filterStore = useFilterStore()
const facetOptionsStore = useFacetOptionsStore()

const { setFilterProp, parseFilterFromQuery } = filterStore
const { filter, serializedFilters, hasSelectedFilters } =
	storeToRefs(filterStore)

const { getOptions } = facetOptionsStore
const { allOptions } = storeToRefs(facetOptionsStore)
//========================================================================================================================================================

const currency = computed(() => {
	const { currency } = numberFormats.value[locale.value]
	return currency.currency
})

const initialMinPrice = 40
const initialMaxPrice = 250

const minPriceExchanged = computed(() => {
	return initialMinPrice * exchangeRates[currency.value]
})
const maxPriceExchanged = computed(() => {
	return initialMaxPrice * exchangeRates[currency.value]
})

const hasQueryFilters = computed(() => {
	return Object.keys(route.query).length
})
//========================================================================================================================================================

watch(currency, () => {
	setFilterProp('price', [minPriceExchanged.value, maxPriceExchanged.value])
})

watch(filter.value, () => {
	router.push({ query: serializedFilters.value })
})
//========================================================================================================================================================

const onSlideEnd = ({ value }) => {
	setFilterProp('price', [...value])
}

onMounted(async () => {
	if (hasQueryFilters.value) {
		parseFilterFromQuery(route.query)
	}
	if (hasSelectedFilters.value) {
		router.push({ query: serializedFilters.value })
	}
	await getOptions()
})
</script>
