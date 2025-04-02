<template>
	<InputText
		unstyled
		:pt="currentTheme"
		:ptOptions="{ mergeProps: ptViewMerge }"
	/>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import InputText, { type InputTextPassThroughOptions } from 'primevue/inputtext'
import { ptViewMerge } from './utils'

const props = defineProps<{ type?: string }>()

const searchTheme = ref<InputTextPassThroughOptions>({
	root: `appearance-none rounded-[1.0625rem] outline-hidden
	  bg-inverse
	  text-primary text-xl
	  font-league
	  border-2 border-primary
	  placeholder:text-surface-300 text-xl dark:placeholder:text-surface-400 focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300
	  enabled:hover:border-t-hover dark:enabled:hover:border-t-hover
	  enabled:focus:border-t-hover
	  p-invalid:border-red-400 dark:p-invalid:border-red-300
	  p-invalid:placeholder:text-red-600 dark:p-invalid:placeholder:text-red-400
	  px-3 py-[.4375rem] p-fluid:w-full
	  p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
	  p-large:text-lg p-large:px-[0.875rem] p-large:py-[0.625rem]
	  
	  p-filled:bg-surface-50 dark:p-filled:bg-surface-800
	  disabled:bg-surface-200 disabled:text-surface-500
	  dark:disabled:bg-surface-700 dark:disabled:text-surface-400
	  transition-colors duration-300 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
})

const theme = ref<InputTextPassThroughOptions>({
	root: `appearance-none rounded-md outline-hidden
	  bg-inverse
	  p-filled:bg-surface-50 dark:p-filled:bg-surface-800
	  text-primary 
	  font-league
	  placeholder:text-surface-500 dark:placeholder:text-surface-400 focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300
	  border border-surface-300 dark:border-surface-700
	  enabled:hover:border-surface-400 dark:enabled:hover:border-surface-600
	  enabled:focus:border-primary
	  disabled:bg-surface-200 disabled:text-surface-500
	  dark:disabled:bg-surface-700 dark:disabled:text-surface-400
	  p-invalid:border-red-400 dark:p-invalid:border-red-300
	  p-invalid:placeholder:text-red-600 dark:p-invalid:placeholder:text-red-400
	  px-3 py-2 p-fluid:w-full
	  p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
	  p-large:text-lg p-large:px-[0.875rem] p-large:py-[0.625rem]
	  transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
})

const currentTheme = computed(() =>
	props.type === 'search' ? searchTheme.value : theme.value,
)
</script>
