<template>
	<Button unstyled :pt="theme" :ptOptions="ptOptions">
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</Button>
</template>

<script setup>
import Button from 'primevue/button'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const theme = {
	root: `inline-flex cursor-pointer select-none items-center justify-center overflow-hidden relative
        px-3 py-2 gap-2 rounded-sm disabled:pointer-events-none disabled:opacity-60 transition-colors duration-200
        bg-surface-700
        border border-primary
        hover:text-surface-700
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2
        focus-visible:outline-surface-600
        p-vertical:flex-col p-fluid:w-full p-fluid:p-icon-only:w-10
        p-icon-only:w-10 p-icon-only:px-0 p-icon-only:gap-0
        p-icon-only:p-rounded:rounded-full p-icon-only:p-rounded:h-10
        p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
        p-large:text-[1.125rem] p-large:px-[0.875rem] p-large:py-[0.625rem]
        p-raised:shadow-sm p-rounded:rounded-[2rem]
        p-outlined:bg-transparent hover:p-outlined:bg-surface-50 active:p-outlined:bg-surface-100
        p-outlined:border-surface-200 hover:p-outlined:border-surface-200 active:p-outlined:border-surface-200
        p-outlined:text-surface-500 hover:p-outlined:text-surface-500
        p-text:bg-transparent
        p-text:border-transparent hover:p-text:border-primary
        p-text:text-surface-500 
    `,
	loadingIcon: ``,
	icon: `p-right:order-1 p-bottom:order-2`,
	label: `font-medium p-icon-only:invisible p-icon-only:w-0
        p-small:text-sm p-large:text-[1.125rem]`,
	pcBadge: {
		root: `min-w-4 h-4 leading-4`,
	},
}
</script>
