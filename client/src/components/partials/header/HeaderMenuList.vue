<template>
	<nav
		id="appNav"
		v-lock-scroll="isHeaderMenuOpen"
		class="bg-primary grid min-w-[14.375rem] grid-cols-3 items-center justify-items-center gap-y-10 ease-in max-md:fixed max-md:-top-0 max-md:left-0 max-md:h-screen max-md:w-full max-md:-translate-x-full max-md:overflow-y-auto max-md:px-4 max-md:pt-[9.375rem] max-md:pb-8 max-md:transition-all max-md:duration-300"
		:class="menuListClass"
	>
		<ul
			class="gx-lg-32-16 col-span-full flex flex-wrap items-center gap-y-5 max-md:flex-col md:gap-y-1"
		>
			<li v-for="r in menuItems" :key="r.label">
				<router-link
					class="hover:text-t-inverse-hover lg:text-lg-24-20 text-inverse font-heading focus-visible:outline-t-inverse-hover rounded-sm text-2xl capitalize outline outline-transparent transition-colors duration-300"
					:active-class="activeLinkClass"
					:to="{ name: r.name, params: r.params }"
				>
					{{ t(r.label) }}
				</router-link>
			</li>
		</ul>
	</nav>
</template>

<script setup>
import { computed } from 'vue'

import { useRoute } from 'vue-router'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useI18n } from 'vue-i18n'

import routeNames from '@/router/routeNames'

const props = defineProps({
	menuItems: {
		type: Array,
		default: () => [],
	},
	isHeaderMenuOpen: {
		type: Boolean,
		default: false,
	},
})

const route = useRoute()

const { t } = useI18n()

const isMobile = useMediaQuery('(max-width: 767.98px)')

const menuListClass = computed(() => {
	if (!isMobile.value) return ''

	return props.isHeaderMenuOpen ? `translate-x-0!` : '-translate-x-full!'
})

const activeLinkClass = computed(() => {
	return route.name === routeNames.PRODUCT_DETAIL ? '' : 'text-t-inverse-hover!'
})
</script>
