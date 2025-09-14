<template>
	<header
		class="bg-primary max-md:before:bg-primary fixed top-0 left-0 z-1002 w-full pr-(--p-scrollbar-width) max-md:before:absolute max-md:before:z-20 max-md:before:h-full max-md:before:w-full lg:min-h-[6.1875rem]"
	>
		<div id="headerContainer" class="container grid gap-y-1 py-3 md:py-6">
			<div
				id="headerTop"
				class="md:gx-lg-100-30 flex items-center justify-between gap-x-4"
			>
				<router-link
					:to="{ name: 'home' }"
					:aria-label="t('accessibility.logo')"
					tabindex="0"
					class="text-inverse font-heading focus-visible:outline-t-inverse-hover z-30 order-2 rounded-sm text-[34px] font-bold outline outline-transparent transition-colors md:order-1"
				>
					DD_SHOP
				</router-link>
				<header-menu-list
					:menuItems="menuItems"
					:is-header-menu-open="isHeaderMenuOpen"
					class="md:order-2"
				/>
				<teleport defer :to="searchInputPosition">
					<main-search-input />
				</teleport>
				<div
					id="headerActions"
					class="md:gx-md-30-8 z-30 order-1 flex items-center gap-2 md:order-4"
				>
					<teleport defer :to="languageSelectPosition">
						<header-language-select class="order-1" />
					</teleport>
					<header-menu-visibility-toggler
						:is-header-menu-open="isHeaderMenuOpen"
						@click="toggleHeaderMenu"
					/>
					<teleport defer :to="curtPosition">
						<router-link
							:to="{ name: 'cart' }"
							:aria-label="t('accessibility.cartLink')"
							class="focus-visible:outline-t-inverse-hover z-30 order-3 flex items-center rounded-sm outline outline-transparent md:order-2"
						>
							<cart-icon
								class="fill-inverse hover:fill-t-inverse-hover [.router-link-active_&]:fill-t-inverse-hover"
							/>
						</router-link>
					</teleport>
					<teleport defer :to="languageSelectPosition">
						<user-control class="order-3" />
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

import { useRoute } from 'vue-router'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useI18n } from 'vue-i18n'
import { useCommonStore } from '@/stores/commonStore'

import { getMenuItems } from '@/utils/getMenuItems'

import CartIcon from '@/components/icons/CartIcon.vue'
import HeaderMenuList from './HeaderMenuList.vue'
import HeaderLanguageSelect from './HeaderLanguageSelect.vue'
import HeaderMenuVisibilityToggler from './HeaderMenuVisibilityToggler.vue'
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

const languageSelectPosition = computed(() =>
	isMobile.value ? '#appNav' : '#headerActions',
)
const searchInputPosition = computed(() => {
	return isTablet.value ? '#headerBottom' : '#headerTop'
})
const curtPosition = computed(() => {
	return isMobile.value ? '#headerTop' : '#headerActions'
})
//========================================================================================================================================================
</script>
