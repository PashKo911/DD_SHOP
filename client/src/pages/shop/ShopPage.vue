<template>
	<div class="flex items-start gap-5">
		<shop-filter class="w-[340px] shrink-0" />
		<div class="grow">
			<div class="not-last:mb-6">
				<h3 class="font-heading text-xl leading-tight font-semibold">
					{{ t('pages.shop.title.countTitle', { count }) }}
				</h3>
			</div>
			<shop-list :items="productsValue" class="mb-8" />
			<paginator
				v-if="isPaginatorVisible"
				:rows="filter.perPage"
				:totalRecords="count"
				v-model="filter.page"
				@page="onPageChange"
			/>
		</div>
	</div>
</template>

<script setup>
import { useProductsStore } from '@/stores/products'
import { useFilterStore } from '@/stores/filter'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

import ShopFilter from './ShopFilter.vue'
import ShopList from './ShopList.vue'
import Paginator from '@/components/paginator/Paginator.vue'

const props = defineProps({
	category: {
		type: String,
	},
})

const productsStore = useProductsStore()
const filterStore = useFilterStore()
const route = useRouter()
const { t } = useI18n({ useScope: 'global' })

const { productsValue, count } = storeToRefs(productsStore)
const { getProducts } = productsStore

const { filter, hasSelectedFilters, hasQueryFilters } = storeToRefs(filterStore)
const { setFilterProp } = filterStore

const isPaginatorVisible = computed(() => {
	return count.value > filter.value.perPage
})

const onPageChange = ({ page }) => {
	setFilterProp('page', page)
}

onMounted(async () => {
	if (!hasQueryFilters.value && !hasSelectedFilters.value) {
		await getProducts()
	}
})
</script>
