<template>
	<skeleton unstyled :pt="theme" :ptOptions="ptOptions" />
</template>

<script setup>
import Skeleton from 'primevue/skeleton'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))
const theme = {
	root: `overflow-hidden bg-surface-100 p-circle:rounded-full animate-pulse`,
}
</script>
