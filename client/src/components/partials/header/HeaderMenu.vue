<template>
	<header
		class="bg-primary max-md:before:bg-primary sticky top-0 z-50 w-full max-md:before:absolute max-md:before:z-20 max-md:before:h-full max-md:before:w-full lg:min-h-[6.1875rem]"
	>
		<div id="headerContainer" class="container grid gap-y-1 py-3 md:py-6">
			<div
				id="headerTop"
				class="md:gx-lg-100-20 flex items-center justify-between gap-x-4"
			>
				<router-link
					:to="{ name: routeNames.HOME }"
					:aria-label="t('accessibility.logo')"
					tabindex="0"
					class="text-inverse font-heading focus-visible:outline-t-inverse-hover z-30 order-2 rounded-sm text-[1.875rem] font-bold outline outline-transparent transition-colors md:order-1 md:text-[2.125rem]"
				>
					DD_SHOP
				</router-link>
				<header-menu-list
					:menuItems="menuItems"
					:is-header-menu-open="isHeaderMenuOpen"
					class="md:order-2"
				/>
				<teleport defer :to="searchInputPosition">
					<main-search-input class="z-20 order-3 grow lg:w-[12.5rem]" />
				</teleport>
				<div
					id="headerActions"
					class="md:gx-md-30-8 z-30 order-1 flex items-center gap-2 md:order-4"
				>
					<div id="headerSelects" class="hidden items-center gap-0.5 md:flex">
						<teleport defer :to="selectsPosition">
							<header-language-select />
						</teleport>
						<teleport defer :to="selectsPosition">
							<header-currency-select />
						</teleport>
					</div>
					<header-menu-visibility-toggler
						:is-header-menu-open="isHeaderMenuOpen"
						@click="toggleHeaderMenu"
					/>
					<teleport defer :to="curtPosition">
						<header-cart-button />
					</teleport>
					<teleport defer :to="userControlPosition">
						<user-control class="order-5" />
					</teleport>
				</div>
			</div>
			<div id="headerBottom" class="lg:hidden"></div>
		</div>
	</header>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useMediaQuery } from '@/composables/useMediaQuery'
import { useI18n } from 'vue-i18n'
import { useCommonStore } from '@/stores/common'

import { getMenuItems } from '@/utils/getMenuItems'
import routeNames from '@/router/routeNames'

import CartIcon from '@/components/icons/CartIcon.vue'
import HeaderMenuList from './HeaderMenuList.vue'
import HeaderLanguageSelect from './HeaderLanguageSelect.vue'
import HeaderCurrencySelect from './HeaderCurrencySelect.vue'
import HeaderMenuVisibilityToggler from './HeaderMenuVisibilityToggler.vue'
import HeaderCartButton from './HeaderCartButton.vue'
import MainSearchInput from '@/components/formControls/MainSearchInput.vue'
import UserControl from '@/components/userControl/UserControl.vue'

//========================================================================================================================================================

const { menuItems } = getMenuItems()
const commonStore = useCommonStore()

const { isHeaderMenuOpen } = storeToRefs(commonStore)
const { toggleHeaderMenu } = commonStore

const { t } = useI18n()

const isMobile = useMediaQuery('(max-width: 767.98px)')
const isTablet = useMediaQuery('(max-width: 991.98px)')
//========================================================================================================================================================

const selectsPosition = computed(() =>
	isMobile.value ? '#appNav' : '#headerSelects',
)
const searchInputPosition = computed(() => {
	return isTablet.value ? '#headerBottom' : '#headerTop'
})
const userControlPosition = computed(() => {
	return isMobile.value ? '#appNav' : '#headerActions'
})
const curtPosition = computed(() => {
	return isMobile.value ? '#headerTop' : '#headerActions'
})
//========================================================================================================================================================
</script>
