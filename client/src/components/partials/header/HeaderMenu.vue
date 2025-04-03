<template>
	<header
		class="bg-primary max-md:before:bg-primary fixed top-0 left-0 z-50 w-full max-md:before:absolute max-md:before:z-20 max-md:before:h-full max-md:before:w-full"
	>
		<div id="headerContainer" class="container grid gap-y-1 py-3 md:py-6">
			<div
				id="headerTop"
				class="md:gx-lg-100-30 flex items-center justify-between gap-x-4"
			>
				<router-link
					:to="{ name: 'shop' }"
					:aria-label="$t('accessibility.logo')"
					class="text-inverse font-heading text-md-34-28 z-30 order-2 font-bold md:order-1"
				>
					DD_SHOP
				</router-link>
				<HeaderMenuList
					:visibleMenuItems="visibleMenuItems"
					class="md:order-2"
				/>
				<teleport defer :to="searchInputPosition">
					<search-input class="z-30 order-3 min-w-[130px] grow" />
				</teleport>
				<div
					id="headerActions"
					class="md:gx-md-30-8 z-30 order-1 flex items-center gap-2 md:order-4"
				>
					<teleport defer :to="languageSelectPosition">
						<header-language-select class="order-1 hidden md:visible" />
					</teleport>
					<HeaderMenuVisibilityToggler @click="menuVisibilityToggler" />
					<teleport defer :to="curtPosition">
						<router-link
							:to="{ name: 'cart' }"
							:aria-label="$t('accessibility.cartLink')"
							class="z-30 order-3 md:order-2"
						>
							<cart-icon class="fill-inverse hover:fill-t-hover duration-300" />
						</router-link>
					</teleport>
					<teleport defer :to="languageSelectPosition">
						<router-link
							:to="{ name: 'signIn' }"
							:aria-label="$t('accessibility.signIn')"
							class="order-3"
						>
							<sign-in-icon
								class="fill-inverse hover:fill-t-hover duration-300"
							/>
						</router-link>
					</teleport>
				</div>
			</div>
			<div id="headerBottom" class="lg:hidden"></div>
		</div>
	</header>
</template>

<script setup>
import CartIcon from '@/components/icons/CartIcon.vue'
import SignInIcon from '@/components/icons/SignInIcon.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import HeaderMenuList from './HeaderMenuList.vue'
import HeaderLanguageSelect from './HeaderLanguageSelect.vue'

import { onBeforeRouteLeave } from 'vue-router'
import router from '@/router'
import { computed } from 'vue'
import { useMediaQuery } from '@/composables/useMediaQuery'
import HeaderMenuVisibilityToggler from './HeaderMenuVisibilityToggler.vue'

const routes = router.getRoutes()

const isMobile = useMediaQuery('(max-width: 767.98px)')
const isTablet = useMediaQuery('(max-width: 991.98px)')

const languageSelectPosition = computed(() =>
	isMobile.value ? '#appNav' : '#headerActions',
)
const searchInputPosition = computed(() => {
	return isTablet.value ? '#headerBottom' : '#headerTop'
})
const curtPosition = computed(() => {
	return isMobile.value ? '#headerTop' : '#headerActions'
})

function checkRoutesList(routeItems, menuItemsRoutes = []) {
	for (const routeItem of routeItems) {
		if (routeItem.children.length)
			checkRoutesList(routeItem.children, menuItemsRoutes)
		//  else if (routeItem.meta?.useInMenu && isRouteAvailable(routeItem)) {
		if (routeItem.meta?.useInMenu) {
			menuItemsRoutes.push({
				name: routeItem.name,
				meta: routeItem.meta,
			})
		}
	}
	return menuItemsRoutes
}

const visibleMenuItems = computed(() => checkRoutesList(routes))

const menuVisibilityToggler = () => {
	document.documentElement.classList.toggle('menu-open')
}

onBeforeRouteLeave((to, from, next) => {
	menuVisibilityToggler()
	next()
})
</script>
