<template>
	<InputText unstyled :pt="theme" :ptOptions="{ mergeProps: ptViewMerge }" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText, { type InputTextPassThroughOptions } from 'primevue/inputtext'
import { ptViewMerge } from '../../volt/utils'

const theme = ref<InputTextPassThroughOptions>({
	root: `appearance-none rounded-md outline-hidden
	  bg-black
	  p-filled:bg-surface-50
	  text-white
	  font-heading leading-tight
	  placeholder:text-creamy-cloud focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300
	  border-2 border-primary
	  enabled:hover:border-t-inverse-hover 
	  enabled:focus:border-t-inverse-hover
	  disabled:bg-surface-200 disabled:text-surface-500
	  p-invalid:border-red-400
	  p-invalid:placeholder:text-red-600
	  px-3 py-2 p-fluid:w-full
	  p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
	  p-large:text-lg p-large:px-[0.875rem] p-large:py-[.6875rem] sm:p-large:py-5 p-large:rounded-lg p-large:text-24-18
	  transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
})
</script>
