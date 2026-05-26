<template>
	<main-layout>
		<router-view />
		<Loader
			:loading="shouldShowWarmupLoader"
			:error="warmupError"
			@retry="retryWarmup"
		/>
	</main-layout>
</template>

<script setup>
import { onMounted } from 'vue'

import { useBackendWarmup } from './composables/useBackendWarmup'
import { useAuthStore } from './stores/auth'

import MainLayout from './components/layouts/MainLayout.vue'
import Loader from './components/ui/feedback/Loader.vue'

const authStore = useAuthStore()
const { shouldShowWarmupLoader, warmupError, warmupBackend } = useBackendWarmup()

function retryWarmup() {
	warmupBackend().catch(() => {})
}

onMounted(() => {
	retryWarmup()
	authStore.initialize()
})
</script>
