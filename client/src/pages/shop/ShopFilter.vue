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
						v-model="styleFilterValue"
						:items="facetOptionsValue.styles"
					/>
				</accordion-content>
			</accordion-panel>
			<accordion-panel value="1">
				<accordion-header>
					{{ t('pages.shop.filter.sectionsTitles.price') }}
				</accordion-header>
				<accordion-content>
					<slider-price
						v-model="priceFilterValue"
						v-if="facetOptionsValue.priceRange[0]"
						:key="currency"
						:min="facetOptionsValue.priceRange[0]"
						:max="facetOptionsValue.priceRange[1]"
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
						v-model="colorFilterValue"
						:items="facetOptionsValue.colors"
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
						v-model="sizeFilterValue"
						:items="facetOptionsValue.sizes"
						multiple
					/>
				</accordion-content>
			</accordion-panel>
		</accordion>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useRoute, useRouter } from 'vue-router'
import { useFacetOptionsStore } from '@/stores/facetOptions'
import { useFilterStore } from '@/stores/filter'
import { useFilterModel } from '@/composables/useFilterModel'

import FilterIcon from '@/components/icons/FilterIcon.vue'
import Accordion from '@/components/accordion/Accordion.vue'
import AccordionPanel from '@/components/accordion/AccordionPanel.vue'
import AccordionHeader from '@/components/accordion/AccordionHeader.vue'
import AccordionContent from '@/components/accordion/AccordionContent.vue'
import StyleRadioGroup from '@/components/formControls/StyleRadioGroup.vue'
import SliderPrice from '@/components/formControls/SliderPrice.vue'
import ColorRadioGroup from '@/components/formControls/ColorRadioGroup.vue'
import SizeRadioGroup from '@/components/formControls/SizeRadioGroup.vue'

const { t, locale } = useI18n()

const route = useRoute()
const router = useRouter()

const filterStore = useFilterStore()
const facetOptionsStore = useFacetOptionsStore()

const { setFilterProp, parseFilterFromQuery } = filterStore
const { filter, serializedFilter, hasSelectedFilters } =
	storeToRefs(filterStore)

const { getFacetOptions } = facetOptionsStore
const { facetOptionsValue, currency } = storeToRefs(facetOptionsStore)

//========================================================================================================================================================
const styleFilterValue = useFilterModel(filter.value, 'styles', setFilterProp)
const priceFilterValue = useFilterModel(filter.value, 'price', setFilterProp)
const colorFilterValue = useFilterModel(filter.value, 'colors', setFilterProp)
const sizeFilterValue = useFilterModel(filter.value, 'sizes', setFilterProp)

const hasQueryFilters = computed(() => {
	return Object.keys(route.query).length
})
//========================================================================================================================================================

watch(filter.value, () => {
	router.push({ query: serializedFilter.value })
})
watch(locale, async () => {
	await getFacetOptions()
})
//========================================================================================================================================================

const onSlideEnd = ({ value }) => {
	setFilterProp('price', [...value])
}

onMounted(async () => {
	await getFacetOptions()

	if (hasQueryFilters.value) {
		parseFilterFromQuery(route.query)
	}
	if (hasSelectedFilters.value) {
		router.push({ query: serializedFilter.value })
	}
})
</script>
