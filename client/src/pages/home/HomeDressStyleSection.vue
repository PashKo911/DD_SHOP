<template>
	<div class="grid justify-items-center gap-8">
		<h2
			class="font-heading text-50-28 text-center leading-tight font-semibold uppercase"
		>
			{{ t('pages.home.sectionTitles.dressStyle') }}
		</h2>
		<div
			class="gy-max-md-32-16 md:gy-md-32-16 grid w-full md:flex md:max-w-[94rem] md:flex-wrap md:gap-x-[2.12766%]"
		>
			<dress-style-card
				v-for="(productData, index) in availableStylesValue"
				:key="productData.id"
				:product-data="productData"
				:index="index"
			/>
		</div>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useFacetOptionsStore } from '@/stores/facetOptions'
import { storeToRefs } from 'pinia'

import { onMounted, watch } from 'vue'
import DressStyleCard from '@/components/cards/DressStyleCard.vue'

const { t, locale } = useI18n()
const facetOptionStore = useFacetOptionsStore()

const { availableStylesValue } = storeToRefs(facetOptionStore)
const { getAvailableStyles } = facetOptionStore

watch(locale, async () => {
	await getAvailableStyles()
})

onMounted(async () => {
	await getAvailableStyles()
})
</script>
