<template>
	<router-view />
</template>

<script setup>
import { useLocales } from '@/composables/useLocales'

const { checkLocale, locale } = useLocales()
checkLocale()
</script>
