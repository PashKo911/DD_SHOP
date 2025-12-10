<template>
	<aside
		class="fixed top-0 bottom-0 left-0 min-h-full w-full max-w-[21.25rem] bg-white px-8 py-5 transition-transform duration-300 ease-in max-lg:z-[1001] lg:relative lg:top-auto lg:bottom-auto lg:max-w-[12.5rem] lg:px-[max(min(1.875vw,_2.25rem),_1.125rem)] lg:pt-9 lg:pb-6"
		:class="toggleClass"
	>
		<div class="sticky lg:top-[8.4375rem]">
			<div class="mb-6 flex items-center justify-between">
				<h1 class="font-heading text-24-18 font-semibold">
					{{ t('pages.dashboard.title') }}
				</h1>

				<Button
					severity="info"
					:aria-label="t('accessibility.buttons.closeSidebar')"
					variant="text"
					rounded
					@click="$emit('closeSidebar')"
					class="w-8 lg:hidden"
				>
					<template #icon>
						<close-icon />
					</template>
				</Button>
			</div>

			<nav class="flex flex-col gap-2">
				<router-link
					:to="{ name: item.to }"
					v-slot="{ isActive }"
					v-for="item in menuItems"
				>
					<div
						:class="[
							'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2',
							isActive
								? 'bg-select-hover font-semibold'
								: 'hover:bg-select-hover',
						]"
					>
						<span>{{ t(item.title) }}</span>
					</div>
				</router-link>
			</nav>
			<teleport to="body">
				<backdrop
					:visible="isMenuOpen"
					v-lock-scroll="isMenuOpen"
					@backdrop-click="$emit('closeSidebar')"
				/>
			</teleport>
		</div>
	</aside>
</template>

<script setup>
import { computed } from 'vue'

import { useMediaQuery } from '@/composables/useMediaQuery'
import { useI18n } from 'vue-i18n'

import Button from '@/components/ui/buttons/Button.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import Backdrop from '@/components/ui/Backdrop.vue'
import routeNames from '@/router/routeNames'

const props = defineProps({
	isMenuOpen: {
		type: Boolean,
		default: false,
	},
})

const emits = defineEmits(['closeSidebar'])
//========================================================================================================================================================
const menuItems = [
	{
		id: 1,
		title: 'pages.dashboard.sidebar.users',
		to: routeNames.dashboardUsers,
	},
	{
		id: 2,
		title: 'pages.dashboard.sidebar.products',
		to: routeNames.dashboardProducts,
	},
]

const { t } = useI18n()

const isDesktop = useMediaQuery('(min-width: 991.98px)')

const toggleClass = computed(() => {
	if (isDesktop.value) return ''

	return props.isMenuOpen ? 'translate-x-0' : '-translate-x-full'
})
</script>
