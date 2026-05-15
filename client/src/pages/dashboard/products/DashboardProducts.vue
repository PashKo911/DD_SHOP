<template>
	<DataTable :value="defaultProducts" :loading="isProductsLoading">
		<template v-if="!isProductsLoading && defaultProducts !== 0" #empty>
			<empty-list />
		</template>
		<Column
			field="image"
			:header="t('pages.dashboard.products.tableTitles.image')"
		>
			<template #body="slotProps">
				<img :src="slotProps.data.image" alt="avatar" width="64" />
			</template>
		</Column>
		<Column
			field="title"
			:header="t('pages.dashboard.products.tableTitles.title')"
		></Column>
		<Column
			field="category"
			:header="t('pages.dashboard.products.tableTitles.category')"
		></Column>
		<Column
			field="price"
			:header="t('pages.dashboard.products.tableTitles.price')"
		></Column>
		<Column
			field="totalCount"
			:header="t('pages.dashboard.products.tableTitles.totalCount')"
		></Column>
		<Column
			field="variantsCount"
			:header="t('pages.dashboard.products.tableTitles.variantsCount')"
		></Column>
		<Column
			field="updatedAt"
			:header="t('pages.dashboard.products.tableTitles.updatedAt')"
		></Column>
		<Column
			field="actions"
			:header="t('pages.dashboard.products.tableTitles.image')"
		></Column>
	</DataTable>
</template>

<script setup>
import { computed, onMounted } from 'vue'

import { useI18n } from 'vue-i18n'
import { useProductsStore } from '@/stores/products'

import EmptyList from '@/components/dataTable/EmptyList.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { Column } from 'primevue'
import { storeToRefs } from 'pinia'

const { t } = useI18n()

const productsStore = useProductsStore()

const { defaultProducts, isProductsLoading } = storeToRefs(productsStore)
const { getDefaultProducts } = productsStore

onMounted(async () => {
	await getDefaultProducts()
})
</script>
