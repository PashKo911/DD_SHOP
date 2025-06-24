<template>
	<AccordionPanel
		:value="props.value"
		unstyled
		:pt="theme"
		:ptOptions="ptOptions"
	>
		<slot></slot>
	</AccordionPanel>
</template>

<script setup>
import AccordionPanel from 'primevue/accordionpanel'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const props = defineProps()
const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const theme = {
	root: `flex flex-col not-last:border-b border-border-color`,
}
</script>
