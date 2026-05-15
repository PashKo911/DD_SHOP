<template>
	<Slider unstyled :pt="theme" :ptOptions="ptOptions" />
</template>

<script setup>
import Slider from 'primevue/slider'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const handleCommon = `cursor-grab touch-none flex items-center justify-center h-[1.25rem] w-[1.25rem]
        bg-primary rounded-full
        transition-colors duration-200
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary
        before:w-[16px] before:h-[1rem] before:block before:rounded-full
        before:bg-surface-0
        before:shadow-[0px_0.5px_0px_0px_rgba(0,0,0,0.08),0px_1px_1px_0px_rgba(0,0,0,0.14)]
        before:transition-colors before:duration-200
        p-horizontal:top-1/2 p-horizontal:-mt-[10px] p-horizontal:-ms-[.625rem]
        p-vertical:start-1/2 p-vertical:-mb-[10px] p-vertical:-ms-[.625rem]`

const theme = {
	root: `relative bg-surface-200 rounded-xs
            p-horizontal:h-[.1875rem]
            p-vertical:min-h-[100px] p-vertical:w-[.1875rem]`,
	range: `block bg-primary rounded-xs
            p-horizontal:top-0 p-horizontal:start-0 p-horizontal:h-full
            p-vertical:bottom-0 p-vertical:start-0 p-vertical:w-full`,
	handle: handleCommon,
	startHandler: handleCommon,
	endHandler: handleCommon,
}
</script>
