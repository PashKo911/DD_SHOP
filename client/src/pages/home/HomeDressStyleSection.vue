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
			<article
				v-for="(s, index) in availableStylesValue"
				:key="s.id"
				class="bg-primary p-maxmd-70-20 md:p-md-70-20 relative flex aspect-[808/292] basis-[53.656915%] overflow-hidden rounded-lg nth-[4n+1]:aspect-[665/292] nth-[4n+1]:basis-[44.215426%] nth-[4n+4]:aspect-[665/292] nth-[4n+4]:basis-[44.215426%] sm:rounded-xl md:rounded-2xl"
				:class="{
					'justify-end': index === 2 || index === 1,
				}"
			>
				<div
					class="flex flex-col items-center"
					:class="{
						'self-end': index === 1 || index === 2,
					}"
				>
					<h3
						class="font-heading text-creamy-cloud text-max-md-55-28 md:text-md-55-38 relative z-[2] leading-tight font-semibold capitalize"
					>
						{{ s.labelUk ?? s.label }}
					</h3>
					<arrow-down-simple />
				</div>
				<img
					:src="`${API_BASE}${s.imgSrc}`"
					:alt="s.labelUk ?? s.label"
					class="pointer-events-none absolute top-0"
					:class="{
						'right-0 w-[70.37594%]': index === 0,
						'left-0 w-[41.831683%]': index === 1,
						'left-0 w-[47.95539%]': index === 2,
						'right-0 w-[60.300752%]': index === 3,
					}"
				/>
			</article>
		</div>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useFacetOptionsStore } from '@/stores/facetOptions'
import { storeToRefs } from 'pinia'
import { API_BASE } from '@/config/apiConfig'

import ArrowDownSimple from '@/components/icons/ArrowDownSimple.vue'
import { onMounted, watch } from 'vue'

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
