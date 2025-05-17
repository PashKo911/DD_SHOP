<template>
	<div class="flex items-start gap-5">
		<shop-filter class="w-[340px] shrink-0" />
		<div class="grow">
			<shop-list :items="sliderData" class="mb-8" />
			<paginator :rows="10" :totalRecords="120" />
		</div>
	</div>
</template>

<script setup>
import sliderData from '@/data/sliderData'

import ShopFilter from './ShopFilter.vue'
import ShopList from './ShopList.vue'
import Paginator from '@/components/paginator/Paginator.vue'

const props = defineProps({
	category: {
		type: String,
	},
})
</script>
