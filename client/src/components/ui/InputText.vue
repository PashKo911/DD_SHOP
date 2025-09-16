<template>
	<InputText unstyled :pt="currentTheme" :ptOptions="ptOptions" />
</template>

<script setup>
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import { ptViewMerge } from '@/utils/volt'

const props = defineProps({
	contrast: { type: Boolean, default: false },
	iconField: { type: Boolean, default: false },
})

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const DEFAULT_THEME = {
	root: `appearance-none rounded-md
	  bg-primary
	  p-filled:bg-surface-50
	  text-creamy-cloud
	  [&:-webkit-autofill]:bg-primary 
	  [&:-webkit-autofill]:[-webkit-text-fill-color:theme(colors.creamy-cloud)]
	  [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]
	  font-heading leading-[1.2] box-border
	  placeholder:text-creamy-cloud focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300
	  border-2 border-transparent
	  enabled:hover:border-t-inverse-hover 
	  enabled:focus:border-t-inverse-hover
	  enabled:focus-visible:outline enabled:focus-visible:outline-1 enabled:focus-visible:outline-offset-2 enabled:focus-visible:outline-primary
	  enabled:focus-visible:border-transparent
	  disabled:bg-surface-200 disabled:text-surface-500
	  p-invalid:border-red-400
	  p-invalid:placeholder:text-red-600
	  px-3 py-2 p-fluid:w-full
	  p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
	  p-large:px-[0.875rem] p-large:py-3 sm:p-large:py-4 p-large:rounded-lg p-large:text-24-18
	  transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
}

const CONTRAST_THEME = {
	...DEFAULT_THEME,
	root: DEFAULT_THEME.root
		.replace('bg-primary', 'bg-inverse')
		.replace('text-creamy-cloud', 'text-primary')
		.replace(
			'enabled:focus-visible:outline-primary',
			'enabled:focus-visible:outline-t-inverse-hover',
		)
		.replace(
			'[&:-webkit-autofill]:bg-primary',
			'[&:-webkit-autofill]:bg-creamy-cloud',
		)
		.replace(
			'[-webkit-text-fill-color:theme(colors.creamy-cloud)]',
			'[-webkit-text-fill-color:theme(colors.primary)]',
		)
		.replace('placeholder:text-creamy-cloud', 'placeholder:text-surface-300'),
}

const currentTheme = computed(() => {
	return props.contrast ? CONTRAST_THEME : DEFAULT_THEME
})
</script>
