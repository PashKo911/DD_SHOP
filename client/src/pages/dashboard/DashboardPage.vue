<template>
	<div class="container flex">
		<dashboard-sidebar
			:is-menu-open="isSidebarOpen"
			@close-sidebar="isSidebarOpen = false"
		/>

		<div class="relative min-w-0 flex-1 p-6">
			<!-- <Button
				size="small"
				v-if="!isDesktop"
				@click="filterVisibilityToggler"
				class="min-w-11 rounded-md!"
			>
				<template #icon>
					<FilterIcon
						class="group-hover:stroke-primary relative shrink-0 stroke-white transition-colors"
					/>
				</template>
			</Button> -->
			<Button
				:aria-label="t('accessibility.buttons.openSidebar')"
				size="small"
				@click="isSidebarOpen = true"
				class="fixed! left-[20px] w-8 min-w-11 rounded-md! sm:top-[150px] md:top-[170px] lg:hidden"
			>
				<template #icon>
					<sidebar-icon
						class="group-hover:stroke-primary relative shrink-0 stroke-white transition-colors"
					/>
				</template>
			</Button>

			<section class="border-border-color rounded-2xl bg-white p-6 shadow-sm">
				<router-view />
			</section>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import DashboardSidebar from './DashboardSidebar.vue'
import Button from '@/components/ui/buttons/Button.vue'
import SidebarIcon from '@/components/icons/SidebarIcon.vue'

const { t } = useI18n()

const isSidebarOpen = ref(false)
</script>
