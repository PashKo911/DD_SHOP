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
						:items="facetOptions.styles"
						v-model="styles"
					/>
				</accordion-content>
			</accordion-panel>

			<accordion-panel value="1">
				<accordion-header>
					{{ t('pages.shop.filter.sectionsTitles.price') }}
				</accordion-header>
				<accordion-content>
					<slider-price
						v-if="facetOptions.price[0]"
						:min="facetOptions.price[0]"
						:max="facetOptions.price[1]"
						v-model="price"
					/>
				</accordion-content>
			</accordion-panel>

			<accordion-panel value="2">
				<accordion-header>
					{{ t('pages.shop.filter.sectionsTitles.color') }}
				</accordion-header>
				<accordion-content>
					<color-radio-group
						multiple
						:items="facetOptions.colors"
						v-model="colors"
					/>
				</accordion-content>
			</accordion-panel>

			<accordion-panel value="3">
				<accordion-header>
					{{ t('pages.shop.filter.sectionsTitles.size') }}
				</accordion-header>
				<accordion-content>
					<size-radio-group
						multiple
						:items="facetOptions.sizes"
						v-model="sizes"
					/>
				</accordion-content>
			</accordion-panel>
		</accordion>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import FilterIcon from '@/components/icons/FilterIcon.vue'
import Accordion from '@/components/accordion/Accordion.vue'
import AccordionPanel from '@/components/accordion/AccordionPanel.vue'
import AccordionHeader from '@/components/accordion/AccordionHeader.vue'
import AccordionContent from '@/components/accordion/AccordionContent.vue'
import StyleRadioGroup from '@/components/formControls/StyleRadioGroup.vue'
import SliderPrice from '@/components/formControls/SliderPrice.vue'
import ColorRadioGroup from '@/components/formControls/ColorRadioGroup.vue'
import SizeRadioGroup from '@/components/formControls/SizeRadioGroup.vue'

const { t } = useI18n()

const props = defineProps({
	facetOptions: {
		type: Object,
		default: () => ({
			styles: [],
			price: [],
			colors: [],
			sizes: [],
		}),
	},
})

const styles = defineModel('styles')
const price = defineModel('price')
const colors = defineModel('colors')
const sizes = defineModel('sizes')
</script>
