<template>
	<Textarea unstyled :pt="theme" :ptOptions />
</template>

<script setup>
import { computed } from 'vue'
import Textarea from 'primevue/textarea'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const theme = {
	root: `appearance-none rounded-md outline-hidden
        bg-white
        p-filled:bg-surface-50
        text-surface-700
        placeholder:text-surface-500
        border border-border-color
        enabled:hover:border-surface-200
	  	enabled:focus:border-primary
        disabled:bg-surface-200 disabled:text-surface-500
        p-invalid:border-red-400
        p-invalid:placeholder:text-red-600
        px-3 py-2 p-fluid:w-full
        p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
        p-large:text-lg p-large:px-[0.875rem] p-large:py-[0.625rem]
        transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
}
</script>
