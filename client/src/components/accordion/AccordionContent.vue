<template>
	<AccordionContent unstyled :pt="theme" :ptOptions="ptOptions">
		<slot></slot>
	</AccordionContent>
</template>

<script setup>
import AccordionContent from 'primevue/accordioncontent'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const theme = {
	root: `flex flex-col`,
	content: `pt-0  pb-[1.125rem]`,
	transition: {
		enterFromClass: 'max-h-0',
		enterActiveClass:
			'overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.42,0,0.58,1)]',
		enterToClass: 'max-h-[1000px]',
		leaveFromClass: 'max-h-[1000px]',
		leaveActiveClass:
			'overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0,1,0,1)]',
		leaveToClass: 'max-h-0',
	},
}
</script>
