<template>
	<main-layout>
		<router-view />
		<Loader :loading="isServerWakeVisible" />
	</main-layout>
</template>

<script setup>
import { useServerWakeState } from './composables/useServerWakeState'

import MainLayout from './components/layouts/MainLayout.vue'
import Loader from './components/loader/Loader.vue'

const { isServerWakeVisible } = useServerWakeState()
</script>
