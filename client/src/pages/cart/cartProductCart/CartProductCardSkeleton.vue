<template>
	<div
		class="not-last:pb-24-16 not-last:mb-24-16 not-last:border-border-color grid gap-4 not-last:border-b sm:flex"
	>
		<Skeleton
			class="group h-[127.083333vw]! w-full! shrink-0 rounded-md sm:h-60! sm:w-40!"
		/>
		<div class="grow">
			<Skeleton width="15rem" height="1.8125rem" class="mb-4 rounded-sm" />
			<Skeleton width="10rem" height="1.5rem" class="mb-2 rounded-sm" />
			<Skeleton width="5rem" height="1.5rem" class="mb-4 rounded-sm" />
			<Skeleton width="10rem" height="1.8125rem" class="rounded-sm" />
		</div>
	</div>
</template>
<script setup>
import Skeleton from '@/components/skeleton/Skeleton.vue'

defineProps({
	productData: {
		type: Object,
		default: null,
	},
})
</script>
