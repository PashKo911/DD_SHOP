<template>
	<Button
		unstyled
		:pt="theme"
		:ptOptions="{
			mergeProps: ptViewMerge,
		}"
	>
		<template #icon>
			<slot name="icon" />
		</template>
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</Button>
</template>

<script setup lang="ts">
import Button, {
	type ButtonPassThroughOptions,
	type ButtonProps,
} from 'primevue/button'
import { ref } from 'vue'
import { ptViewMerge } from '@/utils/volt'

interface Props extends /* @vue-ignore */ ButtonProps {}
defineProps<Props>()

const theme = ref<ButtonPassThroughOptions>({
	root: `inline-flex cursor-pointer select-none items-center justify-center overflow-hidden relative
        px-3 py-3 md:py-[1.125rem] gap-2.5 rounded-2xl disabled:pointer-events-none disabled:opacity-60 transition-colors duration-200
        bg-inverse  enabled:active:bg-b-active
        border  border-transparent   
        font-bold font-heading text-xl
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2
        focus-visible:outline-t-inverse-hover 
        p-vertical:flex-col p-fluid:w-full p-fluid:p-icon-only:w-10
        p-icon-only:w-10 p-icon-only:px-0 p-icon-only:gap-0
        p-icon-only:p-rounded:rounded-full p-icon-only:p-rounded:h-10
        p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
        p-large:px-[0.875rem]  sm:p-large:py-4.5 p-large:rounded-lg 
        p-raised:shadow-sm p-rounded:rounded-[2rem]
        p-outlined:bg-transparent enabled:hover:p-outlined:bg-surface-50 enabled:active:p-outlined:bg-surface-100
        p-outlined:border-surface-700 enabled:hover:p-outlined:border-surface-700 enabled:active:p-outlined:border-surface-700
        p-outlined:text-surface-950 enabled:hover:p-outlined:text-surface-950 enabled:active:p-outlined:text-surface-950
        p-text:bg-transparent enabled:hover:p-text:bg-surface-50 enabled:active:p-text:bg-surface-100
        p-text:border-transparent enabled:hover:p-text:border-transparent enabled:active:p-text:border-transparent
        p-text:text-surface-950 enabled:hover:p-text:text-surface-950 enabled:active:p-text:text-surface-950
		before:rounded-[1.375rem] 
		group before:bg-black relative transition-opacity before:absolute before:inset-[.1875rem] before:scale-0 p-large:before:rounded-[.75rem] before:opacity-0 before:transition-transform before:duration-300 enabled:hover:before:scale-100 enabled:hover:before:opacity-100
    `,
	loadingIcon: ``,
	icon: `p-right:order-1 p-bottom:order-2`,
	label: `font-bold p-icon-only:invisible p-icon-only:w-0 relative
        	group-hover:text-creamy-cloud p-small:text-sm p-large:text-24-18`,
	pcBadge: {
		root: `min-w-4 h-4 leading-4`,
	},
})
</script>
