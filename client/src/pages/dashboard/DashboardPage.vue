<template>
	<div class="container flex">
		<dashboard-sidebar
			:is-menu-open="isSidebarOpen"
			@close-sidebar="isSidebarOpen = false"
		/>

		<div class="relative min-w-0 grow p-6">
			<Button
				:aria-label="t('accessibility.buttons.openSidebar')"
				size="small"
				@click="isSidebarOpen = true"
				class="fixed! left-[1.25rem] z-10 w-8 min-w-11 rounded-md! sm:top-[9.375rem] md:top-[10.625rem] lg:hidden"
			>
				<template #icon>
					<sidebar-icon
						class="group-hover:stroke-primary relative shrink-0 stroke-white transition-colors"
					/>
				</template>
			</Button>
			<div
				class="border-border-color relative min-h-[22.5rem] overflow-hidden rounded-2xl bg-white p-6 shadow-sm"
			>
				<router-view />
			</div>
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
