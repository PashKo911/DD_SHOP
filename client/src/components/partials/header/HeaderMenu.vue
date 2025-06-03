<template>
	<header
		class="bg-primary max-md:before:bg-primary sticky top-0 left-0 z-50 w-full max-md:before:absolute max-md:before:z-20 max-md:before:h-full max-md:before:w-full lg:min-h-[6.1875rem]"
	>
		<div id="headerContainer" class="container grid gap-y-1 py-3 md:py-6">
			<div
				id="headerTop"
				class="md:gx-lg-100-30 flex items-center justify-between gap-x-4"
			>
				<router-link
					:to="{ name: 'home' }"
					:aria-label="$t('accessibility.logo')"
					tabindex="0"
					class="text-inverse font-heading text-md-34-28 focus-visible:outline-t-inverse-hover z-30 order-2 rounded-sm font-bold outline outline-transparent transition-colors md:order-1"
				>
					DD_SHOP
				</router-link>
				<header-menu-list :menuItems="menuItems" class="md:order-2" />
				<teleport defer :to="searchInputPosition">
					<MainSearchInput />
				</teleport>
				<div
					id="headerActions"
					class="md:gx-md-30-8 z-30 order-1 flex items-center gap-2 md:order-4"
				>
					<teleport defer :to="languageSelectPosition">
						<header-language-select class="order-1 hidden md:visible" />
					</teleport>
					<header-menu-visibility-toggler @click="menuVisibilityToggler" />
					<teleport defer :to="curtPosition">
						<router-link
							:to="{ name: 'cart' }"
							:aria-label="$t('accessibility.cartLink')"
							class="focus-visible:outline-t-inverse-hover z-30 order-3 rounded-sm outline outline-transparent md:order-2"
						>
							<cart-icon
								class="fill-inverse hover:fill-t-inverse-hover [.router-link-active_&]:fill-t-inverse-hover duration-300"
							/>
						</router-link>
					</teleport>
					<teleport defer :to="languageSelectPosition">
						<router-link
							to="/auth"
							:aria-label="$t('accessibility.signIn')"
							:class="{ 'fill-t-inverse-hover': isAuthSection }"
							class="focus-visible:outline-t-inverse-hover order-3 rounded-sm outline outline-transparent transition-colors duration-300"
						>
							<sign-in-icon
								:class="{ 'fill-t-inverse-hover': isAuthSection }"
								class="fill-inverse hover:fill-t-inverse-hover duration-300"
							/>
						</router-link>
					</teleport>
				</div>
			</div>
			<div id="headerBottom" class="lg:hidden"></div>
		</div>
		<div
			class="overlay-active:block overlay-active:opacity-100 pointer-events-none fixed inset-0 z-[100] hidden bg-black/30 opacity-0 transition-opacity duration-120"
		></div>
	</header>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useMenuItems } from '@/utils/headerMenuGenerator'
import { useMediaQuery } from '@/composables/useMediaQuery'

import CartIcon from '@/components/icons/CartIcon.vue'
import SignInIcon from '@/components/icons/SignInIcon.vue'
import HeaderMenuList from './HeaderMenuList.vue'
import HeaderLanguageSelect from './HeaderLanguageSelect.vue'
import HeaderMenuVisibilityToggler from './HeaderMenuVisibilityToggler.vue'
import MainSearchInput from '@/components/formControls/MainSearchInput.vue'
const route = useRoute()
const { menuItems } = useMenuItems()

const isMobile = useMediaQuery('(max-width: 767.98px)')
const isTablet = useMediaQuery('(max-width: 991.98px)')

const isAuthSection = computed(() => route.path.startsWith('/auth'))

const languageSelectPosition = computed(() =>
	isMobile.value ? '#appNav' : '#headerActions',
)
const searchInputPosition = computed(() => {
	return isTablet.value ? '#headerBottom' : '#headerTop'
})
const curtPosition = computed(() => {
	return isMobile.value ? '#headerTop' : '#headerActions'
})

const menuVisibilityToggler = () => {
	document.documentElement.classList.toggle('menu-open')
}
</script>
