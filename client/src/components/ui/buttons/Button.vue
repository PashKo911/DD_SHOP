<template>
	<Button unstyled :pt="currentTheme" :ptOptions="ptOptions">
		<template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
			<slot :name="name" v-bind="slotProps ?? {}" />
		</template>
		<template #loadingicon>
			<spinner-icon
				class="stroke-creamy-cloud size-[1.2em]"
				:class="{
					'stroke-primary': contrast,
				}"
			/>
		</template>
	</Button>
</template>

<script setup>
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'

import Button from 'primevue/button'

const props = defineProps({
	contrast: { type: Boolean, default: false },
})

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const currentTheme = computed(() => {
	return props.contrast ? CONTRAST_BUTTON_THEME : DEFAULT_BUTTON_THEME
})

const DEFAULT_BUTTON_THEME = {
	root: `inline-flex group enabled:cursor-pointer select-none items-center justify-center capitalize overflow-hidden relative
	px-3 py-3 gap-2 rounded-md disabled:cursor-default! disabled:pointer-events-none disabled:opacity-60 transition-colors duration-200
	bg-primary border border-2 border-primary text-24-18 font-bold font-heading leading-[1.2]
	hover:border-primary-t-inverse-hover active:border-primary-emphasis-alt
	focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary
	p-vertical:flex-col p-fluid:w-full
	p-icon-only:px-0 p-icon-only:gap-0 p-icon-only:rounded-full
	p-small:text-sm p-small:px-3 p-small:py-2
	p-large:px-[0.875rem] sm:p-large:py-4 p-large:rounded-lg
	p-raised:shadow-sm p-rounded:rounded-[2rem]
	p-outlined:bg-transparent hover:p-outlined:bg-primary-50
	active:p-outlined:bg-primary-100
	p-outlined:border-primary-200 hover:p-outlined:border-primary-200
	p-outlined:text-primary hover:p-outlined:text-primary
	p-text:bg-transparent p-text:[&_span]:text-primary p-text:hover:[&_span]:text-t-hover p-text:p-0 hover:p-text:text-t-inverse-hover hover:p-text:bg-transparent p-text:before:hidden p-text:border-none
	before:rounded-[.4375rem] group before:bg-creamy-cloud
	p-loading:[&_span]:hidden
	before:absolute before:inset-[.1875rem] before:scale-0
	p-large:before:rounded-[.75rem] before:opacity-0 before:transition-transform
	before:duration-300 hover:before:scale-100 hover:before:opacity-100`,
	loadingIcon: ``,
	icon: `p-right:order-1 p-bottom:order-2`,
	label: `p-icon-only:invisible p-icon-only:w-0 relative text-creamy-cloud group-hover:text-primary transition-colors duration-200`,
	pcBadge: {
		root: `min-w-4 h-4 leading-4 bg-primary-contrast rounded-full text-primary text-xs font-bold`,
	},
}

const CONTRAST_BUTTON_THEME = {
	...DEFAULT_BUTTON_THEME,
	root: DEFAULT_BUTTON_THEME.root
		.replace('bg-primary', 'bg-inverse')
		.replace('border-primary', 'border-transparent')
		.replace(
			'focus-visible:outline-primary',
			'focus-visible:outline-t-inverse-hover',
		)
		.replace('before:bg-creamy-cloud', 'before:bg-primary')
		.replace(
			'p-text:[&_span]:text-primary',
			'p-text:[&_span]:text-creamy-cloud',
		)
		.replace(
			'p-text:hover:[&_span]:text-t-hover',
			'p-text:hover:[&_span]:text-t-inverse-hover',
		),

	label: DEFAULT_BUTTON_THEME.label
		.replace('text-creamy-cloud', 'text-primary')
		.replace('group-hover:text-primary', 'group-hover:text-creamy-cloud'),
	pcBadge: {
		root: DEFAULT_BUTTON_THEME.pcBadge.root
			.replace('bg-primary-contrast', 'bg-surface-200')
			.replace('text-primary', 'text-surface-700'),
	},
}
</script>
