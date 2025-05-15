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
		{{ filter }}
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { reactive, onMounted, watchEffect, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dressStyleItems from '@/data/dressStyleItems'
import exchangeRates from '@/locales/exchangeRates'
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
const filter = reactive({
	style: [],
	price: [],
	color: [],
	size: [],
})
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
//========================================================================================================================================================

function serializeFilters(obj) {
	return Object.entries(obj).reduce((q, [key, val]) => {
		if (Array.isArray(val) && val.length) {
			q[key] = val.join(',')
		} else {
			q[key] = val
		}
		return q
	}, {})
}

watch(currency, () => {
	filter.price = [minPriceExchanged.value, maxPriceExchanged.value]
})

watchEffect(() => {
	const query = serializeFilters(filter)
	router.push({ query })
})
//========================================================================================================================================================

const onSlideEnd = ({ value }) => {
	const [minPrice, maxPrice] = value
	console.log(minPrice, maxPrice)
	if (minPrice >= maxPrice) {
		filter.price = [minPriceExchanged.value, maxPriceExchanged.value]
	}
	filter.price = value
}

onMounted(() => {
	for (const key of Object.keys(filter)) {
		const val = route.query[key]
		if (typeof val === 'string' && val.length && val.includes(',')) {
			if (key === 'price') {
				filter[key] = val.split(',').map(Number)
			} else {
				filter[key] = val.split(',')
			}
		}
	}
})
</script>
