<template>
	<div class="flex gap-5">
		<ShopFilter class="w-100 shrink-0" />
		<ShopList :items="sliderData" />
	</div>
</template>

<script setup>
import sliderData from '@/data/sliderData'

import ShopFilter from './ShopFilter.vue'
import ShopList from './ShopList.vue'

const props = defineProps({
	category: {
		type: String,
	},
})
</script>
