<template>
	<article
		class="group any-hover:bg-transparent any-hover:shadow-none any-hover:pb-0 @container flex h-full flex-col bg-white pb-2 shadow-lg duration-500 hover:bg-white hover:shadow-lg"
	>
		<router-link
			:to="{
				name: routeNames.PRODUCT_DETAIL,
				params: routeParams,
			}"
			class="group/image focus-visible:outline-primary relative aspect-[270/405] overflow-hidden bg-white outline-1 outline-transparent transition-colors duration-300 not-last:mb-4 focus-visible:outline-offset-2"
		>
			<img
				:src="`${apiConfig.apiBase}${currentVariant.images[0]}`"
				:alt="data.title"
				:loading="loadingAttr"
				width="420"
				height="630"
				class="absolute inset-0 h-full w-full object-cover"
			/>
			<img
				:src="`${apiConfig.apiBase}${currentVariant.images[1]}`"
				:alt="data.title"
				:loading="loadingAttr"
				width="420"
				height="630"
				class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover/image:opacity-100"
			/>
			<span
				v-if="currentVariant.discount"
				:aria-label="
					t('accessibility.discountLabel', {
						discount: currentVariant.discount,
					})
				"
				class="bg-primary absolute top-0 right-0 p-1.5 text-[max(min(6.5cqw,_1.6875rem),.875rem)] font-semibold text-white"
			>
				{{ currentVariant.discount }}
			</span>
		</router-link>
		<div class="flex grow flex-col justify-between gap-2 px-[3.225806%]">
			<h3>
				<router-link
					:to="{
						name: routeNames.PRODUCT_DETAIL,
						params: routeParams,
					}"
					class="font-heading focus-visible:outline-primary hover:decoration-primary line-clamp-2 w-max rounded-sm text-[max(min(9cqw,_1.625rem),1rem)] leading-tight font-bold underline decoration-transparent outline-1 outline-transparent transition-colors duration-300"
				>
					{{ data.title }}
				</router-link>
			</h3>
			<div class="flex grow flex-col justify-end gap-2">
				<div class="relative grid gap-2 overflow-hidden">
					<div
						class="flex flex-col gap-2 transition-transform duration-300 group-hover:absolute group-hover:-translate-y-full"
					>
						<rating-comp :model-value="currentVariant.rating" readonly />
						<div class="flex flex-wrap items-center gap-x-[7.5%] gap-y-2">
							<span class="text-xl leading-tight font-semibold">
								{{ currentVariant.price }}
							</span>
						</div>
					</div>
					<color-radio-group
						:items="availableColors"
						size="small"
						v-model="activeColorValue"
						class="any-hover:min-h-12 any-hover:items-center any-hover:absolute any-hover:translate-y-full bottom-0 pt-[.125rem] pb-[.375rem] pl-[min(2%,_.125rem)] transition-transform duration-300 group-hover:static group-hover:translate-y-0"
					/>
				</div>
			</div>
		</div>
	</article>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

import apiConfig from '@/config/api'
import routeNames from '@/router/routeNames'

import { useI18n } from 'vue-i18n'
import slugify from '@sindresorhus/slugify'

import RatingComp from '@/components/ui/rating/RatingComp.vue'
import ColorRadioGroup from '@/components/formControls/ColorRadioGroup.vue'

const props = defineProps({
	data: {
		type: Object,
		required: true,
	},
	lazy: {
		type: Boolean,
		default: true,
	},
})
//========================================================================================================================================================

const { t } = useI18n()

const activeVariantId = ref(null)

//========================================================================================================================================================
const availableColors = computed(() => {
	const firstVariants = props.data.variants.slice(0, 4)
	return firstVariants.map((v) => v.color)
})

const currentVariant = computed(() => {
	return props.data.variants.find((v) => v._id === activeVariantId.value)
})

const activeColorValue = computed({
	get() {
		return currentVariant.value.color._id
	},
	set(newColorId) {
		const found = props.data.variants.find((v) => v.color._id === newColorId)
		if (found) {
			activeVariantId.value = found._id
		}
	},
})

const loadingAttr = computed(() => {
	return props.lazy ? 'lazy' : 'eager'
})

const routeParams = computed(() => {
	return {
		category: props.data.categoryKey,
		slug: slugify(props.data.title),
		id: props.data._id,
		variant: activeVariantId.value,
	}
})
//========================================================================================================================================================

watch(
	() => props.data,
	(newData) => {
		if (newData?.defaultVariant) {
			activeVariantId.value = newData.defaultVariant
		}
	},
	{ immediate: true },
)
</script>
