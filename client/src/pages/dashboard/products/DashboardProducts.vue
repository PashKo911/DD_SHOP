<template>
	<section class="flex flex-col gap-5">
		<div class="flex flex-wrap items-center justify-between gap-4">
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

		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<InputText
				variant="surface"
				v-model="filters.title"
				placeholder="Search products..."
				@input="onFilter"
			/>

			<Select
				checkmark
				v-model="filters.category"
				:options="facetOptionsValue.categories"
				:optionLabel="`label.${locale}`"
				optionValue="_id"
				placeholder="Category"
				@change="onFilter"
			/>
			<Select
				checkmark
				v-model="filters.sort"
				:options="optionsData"
				optionLabel="label"
				optionValue="value"
				:placeholder="t(shopConstants.defaultSort.label)"
				@change="onFilter"
			/>
			<Button
				:label="t('buttons.clearAllFilterChips')"
				size="small"
				severity="secondary"
				@click="resetFilters"
			/>
		</div>

		<DataTable
			:value="productsValue"
			:lazy="true"
			:paginator="true"
			:rows="query.perPage"
			:first="query.page * query.perPage"
			:totalRecords="total"
			:loading="isLoadingTable"
			dataKey="_id"
			v-model:expandedRows="expandedRows"
			hoverableRows
			class="dashboard-products-table"
			@row-click="onRowClick"
			@page="onPage"
		>
			<template #empty>
				<empty-list />
			</template>

			<Column expander style="width: 3rem" />

			<Column :header="t('pages.dashboard.products.tableTitles.image')">
				<template #body="{ data }">
					<img
						:src="`${apiConfig.apiBase}${data.variants[0].images[0]}`"
						alt="Product"
						width="60"
						class="aspect-[60/86] object-contain"
					/>
				</template>
			</Column>

			<Column :header="t('pages.dashboard.products.tableTitles.title')">
				<template #body="{ data }">
					{{ data.title }}
				</template>
			</Column>

			<Column :header="t('pages.dashboard.products.tableTitles.category')">
				<template #body="{ data }">
					{{ data.category?.label?.[locale] }}
				</template>
			</Column>

			<Column :header="t('pages.dashboard.products.tableTitles.price')">
				<template #body="{ data }">
					{{ formatPriceRange(data.minPrice, data.maxPrice) }}
				</template>
			</Column>

			<Column :header="t('pages.dashboard.products.tableTitles.totalCount')">
				<template #body="{ data }">
					{{ data.variants?.reduce((sum, v) => sum + (v.count || 0), 0) }}
				</template>
			</Column>

			<Column :header="t('pages.dashboard.products.tableTitles.variantsCount')">
				<template #body="{ data }">
					{{ data.variants?.length }}
				</template>
			</Column>

			<Column :header="t('pages.dashboard.products.tableTitles.updatedAt')">
				<template #body="{ data }">
					{{ d(data.updatedAt) }}
				</template>
			</Column>

			<Column :header="t('pages.dashboard.products.tableTitles.actions')">
				<template #body="{ data }">
					<div class="flex items-center gap-2">
						<SecondaryButton
							size="small"
							variant="outlined"
							:label="t('buttons.edit')"
							@click.stop="
								router.push({
									name: routeNames.dashboardProductEdit,
									params: { id: data._id },
								})
							"
						/>

						<SecondaryButton
							size="small"
							variant="outlined"
							:label="t('buttons.remove')"
							@click.stop="onDeleteProduct(data._id)"
						/>
					</div>
				</template>
			</Column>

			<template #expansion="{ data }">
				<div class="mb-4 bg-black/[0.02] p-4 pl-12">
					<DataTable :value="data.variants" responsiveLayout="scroll">
						<Column header="Image">
							<template #body="{ data: variant }">
								<img
									v-if="variant.images?.[0]"
									:src="`${apiConfig.apiBase}${variant.images[0]}`"
									class="h-14 w-14 object-contain"
								/>
							</template>
						</Column>

						<Column header="Color">
							<template #body="{ data: variant }">
								<div class="flex items-center gap-2">
									<div
										class="h-4 w-4 rounded-full border"
										:style="{ backgroundColor: variant.color?.value }"
									/>
									<span>{{ variant.color?.label?.[locale] }}</span>
								</div>
							</template>
						</Column>

						<Column header="Price">
							<template #body="{ data: variant }">
								<div class="flex flex-col">
									<span>${{ variant.price }}</span>
									<span v-if="variant.oldPrice" class="text-xs line-through">
										${{ variant.oldPrice }}
									</span>
								</div>
							</template>
						</Column>

						<Column header="Count">
							<template #body="{ data: variant }">
								<span>{{ variant.count }}</span>
							</template>
						</Column>

						<Column header="Rating">
							<template #body="{ data: variant }">
								<span>⭐ {{ variant.rating }}</span>
							</template>
						</Column>
					</DataTable>
				</div>
			</template>
		</DataTable>
	</section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import { useAdminProductsStore } from '@/stores/adminProducts'
import { useRouter } from 'vue-router'
import { useCommonStore } from '@/stores/common'
import { useFacetOptionsStore } from '@/stores/facetOptions'
import { useWatcherAbortController } from '@/composables/useWatcherAbortController'
import { formatPriceRange } from '@/utils/productsHelpers/formatPriceRange'
import debounce from '@/utils/debounce'

import routeNames from '@/router/routeNames'
import apiConfig from '@/config/api'
import shopConstants from '@/constants/shop'
import sortOptionsData from '@/data/sortOptions'

import EmptyList from '@/components/dataTable/EmptyList.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import Button from '@/components/ui/buttons/Button.vue'
import InputText from '@/components/ui/InputText.vue'
import Select from '@/components/ui/Select.vue'
import SecondaryButton from '@/components/ui/buttons/SecondaryButton.vue'
import { Column } from 'primevue'

const { t, d } = useI18n()

const adminStore = useAdminProductsStore()
const commonStore = useCommonStore()
const facetOptionsStore = useFacetOptionsStore()
const router = useRouter()

const { locale, currency } = storeToRefs(commonStore)
const { query, productsValue, total, isLoadingTable } = storeToRefs(adminStore)
const { getAdminProducts, setQuery, deleteProduct, resetQuery } = adminStore

const { getFacetOptions } = facetOptionsStore
const { facetOptionsValue } = storeToRefs(facetOptionsStore)

const expandedRows = ref([])

const filters = ref({
	title: '',
	category: null,
	sort: shopConstants.defaultSort.value,
})

const optionsData = computed(() => {
	return sortOptionsData.map((o) => ({ ...o, label: t(o.label) }))
})

const debouncedFetch = debounce(() => {
	getAdminProducts()
}, 400)

const onFilter = () => {
	setQuery({
		page: 0,
		title: filters.value.title,
		category: filters.value.category,
		sort: filters.value.sort,
	})

	debouncedFetch()
}

const resetFilters = () => {
	filters.value = {
		title: '',
		category: null,
		sort: shopConstants.defaultSort.value,
	}

	resetQuery()
	getAdminProducts()
}

const onPage = (event) => {
	setQuery({
		page: event.page,
		perPage: event.rows,
	})

	getAdminProducts()
}

const onRowClick = ({ data }) => {
	router.push({
		name: routeNames.PRODUCT_DETAIL,
		params: {
			category: data.categoryKey,
			slug: data.title,
			id: data._id,
			variant: data.defaultVariant,
		},
	})
}

const onDeleteProduct = async (id) => {
	await deleteProduct(id)
	getAdminProducts()
}

/* ================= WATCHERS ================= */

watch([locale, currency], () => {
	const { signal } = useWatcherAbortController()
	getAdminProducts(null, signal)
})
//========================================================================================================================================================

onMounted(() => {
	getAdminProducts()
	getFacetOptions()
})
</script>
