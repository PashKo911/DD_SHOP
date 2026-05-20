<template>
	<InputText unstyled :pt="currentTheme" :ptOptions="ptOptions" />
</template>

<script setup>
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import { ptViewMerge } from '@/utils/volt'

const props = defineProps({
	variant: {
		type: String,
		default: 'primary',
	},
	iconField: {
		type: Boolean,
		default: false,
	},
})

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const BASE_THEME = {
	root: `appearance-none rounded-md
	  font-heading leading-[1.2] box-border
	  placeholder:transition-opacity placeholder:duration-300
	  focus:placeholder:opacity-0
	  disabled:bg-surface-200 disabled:text-surface-500
	  p-invalid:border-red-400
	  p-invalid:placeholder:text-red-600
	  px-3 py-2 p-fluid:w-full
	  p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
	  p-large:px-[0.875rem] p-large:py-3 sm:p-large:py-4
	  p-large:rounded-lg p-large:text-24-18
	  transition-colors duration-200
	  shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
}

const PRIMARY_THEME = {
	...BASE_THEME,
	root: `${BASE_THEME.root}
	  bg-primary
	  text-creamy-cloud
	  border-2 border-transparent

	  placeholder:text-creamy-cloud

	  enabled:hover:border-t-inverse-hover
	  enabled:focus:border-t-inverse-hover

	  enabled:focus-visible:outline
	  enabled:focus-visible:outline-1
	  enabled:focus-visible:outline-offset-2
	  enabled:focus-visible:outline-primary
	  enabled:focus-visible:border-transparent

	  p-filled:bg-surface-50

	  [&:-webkit-autofill]:bg-primary
	  [&:-webkit-autofill]:[-webkit-text-fill-color:theme(colors.creamy-cloud)]
	  [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]`,
}

const SURFACE_THEME = {
	...BASE_THEME,
	root: `${BASE_THEME.root}
	  bg-white
	  text-primary
	  border border-border-color

	  placeholder:text-primary

	  enabled:hover:border-surface-200
	  enabled:focus:border-primary

	  enabled:focus-visible:outline-none

	  p-filled:bg-surface-50

	  [&:-webkit-autofill]:bg-white
	  [&:-webkit-autofill]:[-webkit-text-fill-color:theme(colors.primary)]
	  [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]`,
}

const ACCENT_THEME = {
	...BASE_THEME,
	root: `${BASE_THEME.root}
	  bg-white
	  text-primary
	  border-2 border-transparent

	  placeholder:text-primary

	  enabled:hover:border-t-inverse-hover
	  enabled:focus:border-t-inverse-hover

	  enabled:focus-visible:outline
	  enabled:focus-visible:outline-1
	  enabled:focus-visible:outline-offset-2
	  enabled:focus-visible:outline-t-inverse-hover
	  enabled:focus-visible:border-transparent

	  p-filled:bg-surface-50

	  [&:-webkit-autofill]:bg-white
	  [&:-webkit-autofill]:[-webkit-text-fill-color:theme(colors.primary)]
	  [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]`,
}

const themes = {
	primary: PRIMARY_THEME,
	surface: SURFACE_THEME,
	accent: ACCENT_THEME,
}

const currentTheme = computed(() => {
	return themes[props.variant] ?? PRIMARY_THEME
})
</script>
