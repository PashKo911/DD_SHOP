<template>
	<DataTable :value="adminProductsValue" :loading="isProductsLoading">
		<template v-if="!isProductsLoading && adminProductsValue !== 0" #empty>
			<empty-list />
		</template>
		<Column :header="t('pages.dashboard.products.tableTitles.image')">
			<template #body="slotProps">
				<img
					:src="`${apiConfig.apiBase}${slotProps.data.image}`"
					alt="avatar"
					width="64"
					class="object-contain"
				/>
			</template>
		</Column>
		<Column
			field="title"
			:header="t('pages.dashboard.products.tableTitles.title')"
		></Column>
		<Column
			:field="`category.${locale}`"
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
		>
			<template #body="slotProps">
				{{ d(slotProps.data.updatedAt) }}
			</template>
		</Column>
		<Column
			field="actions"
			:header="t('pages.dashboard.products.tableTitles.actions')"
		></Column>
	</DataTable>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Column } from 'primevue'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '@/stores/products'
import apiConfig from '@/config/api'

import EmptyList from '@/components/dataTable/EmptyList.vue'
import DataTable from '@/components/dataTable/DataTable.vue'

const { t, locale, d } = useI18n()

const productsStore = useProductsStore()

const { adminProductsValue, isProductsLoading } = storeToRefs(productsStore)
const { getDefaultProducts } = productsStore

onMounted(async () => {
	await getDefaultProducts()
})
</script>
