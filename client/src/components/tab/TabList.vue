<template>
	<TabList unstyled :pt="theme" :ptOptions="ptOptions">
		<slot></slot>
	</TabList>
</template>

<script setup>
import TabList from 'primevue/tablist'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))
const props = defineProps()

const navButton = `!absolute flex-shrink-0 top-0 z-20 h-[calc(100%_-0.0625rem)] flex items-center justify-center cursor-pointer
        bg-creamy-cloud/90 text-primary hover:text-surface-700 w-10
        focus-visible:z-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-primary
        transition-colors duration-200`

const theme = {
	root: `flex relative`,
	prevButton: navButton + ` start-0`,
	nextButton: navButton + ` end-0`,
	content: `flex-grow
        p-scrollable:overflow-x-auto p-scrollable:overflow-y-hidden p-scrollable:overscroll-y-contain p-scrollable:overscroll-x-auto
        scroll-smooth [scrollbar-width:none]`,
	tabList: `relative flex border-b border-border-color
        p-scrollable:overflow-hidden`,
	activeBar: `z-40 block absolute -bottom-px h-[.3125rem] bg-primary transition-[left] rounded-r-full rounded-l-full duration-300 ease-[cubic-bezier(0.35,0,0.25,1)]`,
}
</script>
