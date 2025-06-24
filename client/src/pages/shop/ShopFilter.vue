<template>
	<aside
		class="border-border-color fixed top-[7.6875rem] right-0 bottom-0 z-[1001] w-full max-w-[21.25rem] overflow-y-auto border-l bg-white px-8 py-5 transition-transform duration-300 ease-in md:top-[9.4375rem] lg:static lg:rounded-2xl lg:border lg:px-[max(min(1.875vw,_2.25rem),_1.125rem)] lg:pt-9 lg:pb-6"
		:class="filterToggleClass"
	>
		<div
			class="border-border-color flex items-center justify-between gap-8 border-b pb-4 md:pb-8"
		>
			<h2 class="font-heading text-32-26 leading-tight font-bold">
				{{ t('pages.shop.filter.title') }}
			</h2>
			<Button
				variant="text"
				:aria-label="t('buttons.closeFilter')"
				@click="onFilterClose"
				class="aspect-square w-10"
			>
				<component
					:is="filterHeaderIcon"
					class="w-5"
					:class="{
						'stroke-dark-grey': isDesktop,
					}"
				/>
			</Button>
		</div>

		<accordion :value="['0', '1', '2', '3', '4']" multiple>
			<accordion-panel v-if="!isDesktop && activeChips.length" value="0">
				<accordion-header>
					{{ t('pages.shop.filter.sectionsTitles.activeFilters') }}
				</accordion-header>
				<accordion-content>
					<shop-chips-group
						v-show="activeChips.length"
						:items="activeChips"
						@remove="onRemoveChip"
						@remove-all="onRemoveAll"
					/>
				</accordion-content>
			</accordion-panel>
			<accordion-panel value="1">
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

			<accordion-panel value="2">
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

			<accordion-panel value="3">
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

			<accordion-panel value="4">
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
		<teleport to="body">
			<backdrop
				:visible="isFilterOpen"
				v-lock-scroll="isFilterOpen"
				@backdrop-click="onFilterClose"
			/>
		</teleport>
	</aside>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMediaQuery } from '@/composables/useMediaQuery'

import FilterIcon from '@/components/icons/FilterIcon.vue'
import Accordion from '@/components/accordion/Accordion.vue'
import AccordionPanel from '@/components/accordion/AccordionPanel.vue'
import AccordionHeader from '@/components/accordion/AccordionHeader.vue'
import AccordionContent from '@/components/accordion/AccordionContent.vue'
import StyleRadioGroup from '@/components/formControls/StyleRadioGroup.vue'
import SliderPrice from '@/components/formControls/SliderPrice.vue'
import ColorRadioGroup from '@/components/formControls/ColorRadioGroup.vue'
import SizeRadioGroup from '@/components/formControls/SizeRadioGroup.vue'
import Button from '@/components/ui/button/Button.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import Backdrop from '@/components/ui/Backdrop.vue'
import ShopChipsGroup from './ShopChipsGroup.vue'

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
	isFilterOpen: {
		type: Boolean,
		default: false,
	},
	activeChips: {
		type: Array,
		default: [],
	},
})
//========================================================================================================================================================

const styles = defineModel('styles')
const price = defineModel('price')
const colors = defineModel('colors')
const sizes = defineModel('sizes')

const emits = defineEmits(['closeFilter', 'removeChip', 'removeAll'])
//========================================================================================================================================================

const { t } = useI18n()
const isDesktop = useMediaQuery('(min-width: 991.98px)')
//========================================================================================================================================================

const filterToggleClass = computed(() => {
	if (isDesktop.value) return ''

	return props.isFilterOpen ? 'translate-x-0' : 'translate-x-full'
})

const filterHeaderIcon = computed(() => {
	return isDesktop.value ? FilterIcon : CloseIcon
})

//========================================================================================================================================================

const onFilterClose = () => {
	emits('closeFilter')
}
const onRemoveChip = (chip) => {
	emits('removeChip', chip)
}
const onRemoveAll = () => {
	emits('removeAll')
}
</script>
