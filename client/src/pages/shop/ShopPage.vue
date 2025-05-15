<template>
	<div class="flex items-start gap-5">
		<ShopFilter class="w-[340px] shrink-0" />
		<div class="grow">
			<ShopList :items="sliderData" />
		</div>
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
