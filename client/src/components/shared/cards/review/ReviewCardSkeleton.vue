<template>
	<skeleton height="14.375rem" class="rounded-lg" />
</template>

<script setup>
import Skeleton from '@/components/ui/feedback/Skeleton.vue'

defineProps({
	reviewData: {
		type: Object,
		default: null,
	},
})
</script>
