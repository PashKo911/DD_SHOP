<template>
	<Breadcrumb :home="home" :model="items">
		<template #item="{ item, props }">
			<router-link
				v-if="!item.isLast"
				v-slot="{ href, navigate }"
				:to="item.route"
				custom
			>
				<a
					:href="href"
					v-bind="props.action"
					@click="navigate"
					class="hover:text-t-hover capitalize underline decoration-transparent transition-colors"
				>
					<span>{{ item.label }}</span>
				</a>
			</router-link>
			<span
				v-else
				v-bind="props.action"
				aria-current="page"
				class="text-t-hover font-bold capitalize"
			>
				<span>{{ item.label }}</span>
			</span>
		</template>
	</Breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProductsStore } from '@/stores/products'
import routeNames from '@/router/routeNames'

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

const route = useRoute()
const { t } = useI18n()
const productsStore = useProductsStore()

const { productDetails, isProductDetailsLoaded } = storeToRefs(productsStore)
//========================================================================================================================================================

const items = computed(() => {
	return route.matched
		.filter((r) => r.meta?.localeName)
		.map((record, idx, arr) => {
			const isLast = idx === arr.length - 1
			const localeKey = resolveLocaleName(record.meta.localeName, route)

			if (route.name === routeNames.PRODUCT_DETAIL && isLast) {
				if (!isProductDetailsLoaded.value) {
					return null
				}
				return {
					label: productDetails.value.title,
					route: { name: record.name },
					isLast,
				}
			}

			return {
				label: t(localeKey ?? record.name),
				route: { name: record.name },
				isLast,
			}
		})
		.filter(Boolean)
})

const home = computed(() => ({
	label: t('pages.home.title.menu'),
	route: { name: routeNames.HOME },
}))

//========================================================================================================================================================

function resolveLocaleName(localeName, route) {
	if (!localeName) return null
	return typeof localeName === 'function'
		? localeName(route.params.category)
		: localeName
}
</script>
