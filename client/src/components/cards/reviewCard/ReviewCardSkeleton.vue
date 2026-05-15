<template>
	<skeleton height="14.375rem" class="rounded-lg" />
</template>

<script setup>
import Skeleton from '@/components/skeleton/Skeleton.vue'

defineProps({
	reviewData: {
		type: Object,
		default: null,
	},
})
</script>
