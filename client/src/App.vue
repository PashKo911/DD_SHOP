<template>
	<main-layout>
		<router-view />
	</main-layout>
</template>

<script setup>
import { useLocales } from '@/composables/useLocales'
import MainLayout from './components/layouts/MainLayout.vue'

const { checkLocale, locale } = useLocales()
checkLocale()
</script>
