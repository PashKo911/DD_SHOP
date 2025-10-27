<template>
	<div class="@container">
		<skeleton height="149.677419cqw" class="mb-4 aspect-[3/3.6]" />
		<skeleton width="60%" class="mb-2 h-[max(min(10.8cqw,_1.95rem),1.2rem)]!" />
		<skeleton height="1rem" width="40%" class="mb-2" />
		<skeleton height="1.5rem" width="20%" />
	</div>
</template>

<script setup>
import Skeleton from '@/components/skeleton/Skeleton.vue'

defineProps({
	data: {
		type: Object,
		default: null,
	},
})
</script>
