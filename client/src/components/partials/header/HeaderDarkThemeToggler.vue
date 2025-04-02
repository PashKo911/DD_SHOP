<template>
	<ToggleSwitch v-model="checked">
		<template #handle="{ checked }">
			<sun-icon v-if="checked" class="fill-surface-0 w-3" />
			<moon-icon v-else class="w-3" />
		</template>
	</ToggleSwitch>
	<!-- <button
		type="button"
		class="enabled:hover:bg-primary-500/15 text-surface-900 dark:text-surface-0 focus-visible:ring-primary focus-visible:ring-offset-surface-0 dark:focus-visible:ring-offset-surface-950 border-primary-200 dark:border-primary-700 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-all focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-hidden focus-visible:outline-none"
		aria-label="Toggle dark mode"
		@click="toggleDarkMode"
	>
		<sun class="fill-surface-0 hidden aspect-square w-6 dark:block" />
		<moon class="aspect-square w-6 dark:hidden" />
	</button> -->
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import SunIcon from '@/components/icons/SunIcon.vue'
import MoonIcon from '@/components/icons/MoonIcon.vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'

const checked = ref(false)

onMounted(() => {
	const theme = localStorage.getItem('theme')
	if (theme === 'dark') {
		checked.value = true
		document.documentElement.classList.add('p-dark')
	} else {
		checked.value = false
		document.documentElement.classList.remove('p-dark')
	}
})

watch(checked, (newVal) => {
	if (newVal) {
		localStorage.setItem('theme', 'dark')
		document.documentElement.classList.add('p-dark')
	} else {
		localStorage.setItem('theme', 'light')
		document.documentElement.classList.remove('p-dark')
	}
})

window.addEventListener('storage', (e) => {
	if (e.key === 'theme') {
		if (e.newValue === 'dark') {
			checked.value = true
			document.documentElement.classList.add('p-dark')
		} else {
			checked.value = false
			document.documentElement.classList.remove('p-dark')
		}
	}
})
</script>
