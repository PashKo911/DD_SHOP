<template>
	<Accordion unstyled :pt="theme" :ptOptions="ptOptions">
		<slot></slot>
	</Accordion>
</template>

<script setup>
import Accordion from 'primevue/accordion'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))
const theme = {
	root: '',
}
</script>
