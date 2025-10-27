<template>
	<skeleton
		class="basis-[53.656915%] rounded-lg pb-[43.835616%] nth-[4n+1]:basis-[44.215426%] nth-[4n+4]:basis-[44.215426%] sm:rounded-xl md:rounded-2xl md:pb-[19.414894%]"
	/>
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
