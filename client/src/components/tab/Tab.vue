<template>
	<Tab :value="props.value" unstyled :pt="theme" :ptOptions="ptOptions">
		<slot></slot>
	</Tab>
</template>

<script setup>
import Tab from 'primevue/tab'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))
const props = defineProps()

const theme = {
	root: `flex-shrink-0 grow basis-[33.3333%] cursor-pointer select-none relative whitespace-nowrap py-4 px-[1.125rem]
        border-b border-border-color font-semibold
        font-heading text-[#878484] md:text-[1.5rem] text-[1.125rem]
        transition-colors duration-200 -mb-px
        not-p-active:enabled:hover:text-primary
        p-active:text-primary
        disabled:pointer-events-none disabled:opacity-60
        focus-visible:z-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-primary`,
}
</script>
