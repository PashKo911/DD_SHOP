<template>
	<TabPanels unstyled :pt="theme" :ptOptions="ptOptions">
		<slot></slot>
	</TabPanels>
</template>

<script setup>
import TabPanels from 'primevue/tabpanels'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))
const props = defineProps()

const theme = {
	root: `text-surface-primary
        pt-80-30  outline-none`,
}
</script>
