<template>
	<div class="grid justify-items-center gap-8">
		<h2
			class="font-heading text-50-28 text-center leading-tight font-semibold uppercase"
		>
			{{ t('pages.home.sectionTitles.dressStyle') }}
		</h2>
		<error-message-block
			v-if="isErrorBlockVisible"
			:is-loading="isLoading"
			@reload-items="$emit('reloadItems')"
			class="w-full"
		/>
		<div
			v-else
			class="gy-max-md-32-16 md:gy-md-32-16 grid w-full md:flex md:max-w-[94rem] md:flex-wrap md:gap-x-[2.12766%]"
		>
			<component
				:is="activeComponent"
				v-for="(productData, idx) in isLoading ? itemsCount : items"
				:key="isLoading ? idx : productData._id"
				:product-data="productData"
				:index="idx"
			/>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import DressStyleCard from '@/components/cards/dressStyleCard/DressStyleCard.vue'
import DressStyleCardSkeleton from '@/components/cards/dressStyleCard/DressStyleCardSkeleton.vue'
import ErrorMessageBlock from '@/components/errorMessageBlock/ErrorMessageBlock.vue'

const { t } = useI18n()

defineEmits(['reloadItems'])

const props = defineProps({
	items: {
		type: Array,
		default: [],
	},
	itemsCount: {
		type: Number,
		default: 4,
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
	hasError: {
		type: Boolean,
		default: false,
	},
})

const activeComponent = computed(() => {
	return props.isLoading ? DressStyleCardSkeleton : DressStyleCard
})

const isErrorBlockVisible = computed(() => {
	return (props.hasError || !props.items.length) && !props.isLoading
})
</script>
