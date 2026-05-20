<template>
	<section class="flex flex-col gap-5">
		<div class="flex items-center justify-between gap-4">
			<div>
				<h1 class="font-heading text-primary text-3xl font-semibold">
					{{ t('pages.dashboard.products.title') }}
				</h1>
				<p class="text-surface-500 mt-1 text-sm">
					{{ t('pages.dashboard.products.subtitle') }}
				</p>
			</div>
			<Button
				:label="t('pages.dashboard.products.createProduct')"
				size="small"
				severity="secondary"
				@click="router.push({ name: routeNames.dashboardProductCreate })"
			/>
		</div>

		<DataTable :value="adminProductsValue" :loading="isProductsLoading">
			<template v-if="!isProductsLoading && adminProductsValue !== 0" #empty>
				<empty-list />
			</template>
			<Column :header="t('pages.dashboard.products.tableTitles.image')">
				<template #body="slotProps">
					<img
						:src="`${apiConfig.apiBase}${slotProps.data.image}`"
						alt="Product"
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
			<Column :header="t('pages.dashboard.products.tableTitles.actions')">
				<template #body="slotProps">
					<div class="flex items-center gap-2">
						<SecondaryButton
							size="small"
							variant="outlined"
							:label="t('buttons.edit')"
							@click="
								router.push({
									name: routeNames.dashboardProductEdit,
									params: { id: slotProps.data.id },
								})
							"
						/>
						<SecondaryButton
							size="small"
							variant="outlined"
							:label="t('buttons.remove')"
							@click="deleteProduct(slotProps.data.id)"
						/>
					</div>
				</template>
			</Column>
		</DataTable>
	</section>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Column } from 'primevue'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '@/stores/products'
import routeNames from '@/router/routeNames'
import apiConfig from '@/config/api'

import EmptyList from '@/components/dataTable/EmptyList.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import Button from '@/components/ui/buttons/Button.vue'
import SecondaryButton from '@/components/ui/buttons/SecondaryButton.vue'

const { t, locale, d } = useI18n()
const router = useRouter()
const productsStore = useProductsStore()

const { adminProductsValue, isProductsLoading } = storeToRefs(productsStore)
const { getDefaultProducts, deleteProduct } = productsStore

onMounted(async () => {
	await getDefaultProducts()
})
</script>
