<template>
	<Button
		unstyled
		:pt="theme"
		:ptOptions="{
			mergeProps: ptViewMerge,
		}"
	>
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
        px-3 py-2 gap-2 rounded-md disabled:pointer-events-none disabled:opacity-60 transition-colors duration-200
        bg-primary enabled:hover:bg-primary-emphasis enabled:active:bg-primary-emphasis-alt text-primary font-bold font-heading
        border border-primary enabled:hover:border-primary-emphasis enabled:active:border-primary-emphasis-alt
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary
        p-vertical:flex-col p-fluid:w-full p-fluid:p-icon-only:w-10
        p-icon-only:w-10 p-icon-only:px-0 p-icon-only:gap-0
        p-icon-only:p-rounded:rounded-full p-icon-only:p-rounded:h-10
        p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
        p-large:px-[0.875rem]  sm:p-large:py-4.5 p-large:rounded-lg
        p-raised:shadow-sm p-rounded:rounded-[2rem]
        p-outlined:bg-transparent enabled:hover:p-outlined:bg-primary-50 enabled:active:p-outlined:bg-primary-100
        p-outlined:border-primary-200 enabled:hover:p-outlined:border-primary-200 enabled:active:p-outlined:border-primary-200
        p-outlined:text-primary enabled:hover:p-outlined:text-primary enabled:active:p-outlined:text-primary
        p-text:bg-transparent enabled:hover:p-text:bg-creamy-cloud 
        p-text:border-transparent enabled:hover:p-text:border-transparent enabled:active:p-text:border-transparent
        p-text:text-primary enabled:hover:p-text:text-primary enabled:active:p-text:text-primary

		before:rounded-[.4375rem] p-text:before:hidden
		group before:bg-creamy-cloud relative transition-opacity before:absolute before:inset-[.1875rem] before:scale-0 p-large:before:rounded-[.75rem] before:opacity-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:before:opacity-100
    `,
	loadingIcon: ``,
	icon: `p-right:order-1 p-bottom:order-2`,
	label: `font-bold p-icon-only:invisible p-icon-only:w-0
        p-small:text-sm p-large:text-24-18
		group-hover:text-primary text-creamy-cloud relative transition-colors 
		`,
	pcBadge: {
		root: `min-w-4 h-4 leading-4 bg-primary-contrast rounded-full text-primary text-xs font-bold`,
	},
})
</script>
