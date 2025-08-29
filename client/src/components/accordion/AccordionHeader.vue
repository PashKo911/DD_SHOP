<template>
	<AccordionHeader unstyled :pt="theme" :ptOptions="ptOptions">
		<template #toggleicon="{ active }">
			<ChevronDownIcon
				class="transition-transform duration-300"
				:class="{
					'rotate-180': active,
				}"
			/>
		</template>
		<slot></slot>
	</AccordionHeader>
</template>

<script setup>
import ChevronDownIcon from '@primevue/icons/chevronup'
import AccordionHeader from 'primevue/accordionheader'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const theme = {
	root: `cursor-pointer disabled:pointer-events-none disabled:opacity-60 flex items-center justify-between py-[1.125rem] font-semibold text-left
        text-primary capitalize font-heading font-bold text-24-18 leading-tight
        hover:text-surface-700
        p-active:text-surface-700
        transition-colors duration-300
        focus-visible:outline focus-visible:outline-1 rounded-sm focus-visible:outline-offset-[-1px] focus-visible:outline-primary`,
}
</script>
