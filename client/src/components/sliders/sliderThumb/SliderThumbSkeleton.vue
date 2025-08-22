<template>
	<div
		class="flex w-full flex-col-reverse gap-6 overflow-hidden p-2.5 sm:flex-row sm:p-5 lg:max-w-[51.875rem]"
	>
		<div
			class="grid max-w-full gap-[1.25rem] max-sm:grid-cols-3 sm:basis-[23.631841%] sm:grid-rows-3"
		>
			<skeleton
				v-for="s in smallSlidesCount"
				class="h-full! rounded-lg shadow-lg max-sm:aspect-[143/215]"
			/>
		</div>
		<skeleton
			class="aspect-[457/686] max-w-full overflow-hidden rounded-lg shadow-lg sm:basis-[75.243781%]"
			height="100%"
		/>
	</div>
</template>

<script setup>
import Skeleton from '@/components/skeleton/Skeleton.vue'
import { ref } from 'vue'

defineProps({
	imagesList: { type: Array, default: () => [] },
	altImageAttr: { type: String, default: '' },
})

const smallSlidesCount = ref(3)
</script>
