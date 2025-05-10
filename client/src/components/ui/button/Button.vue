<template>
	<Button unstyled :pt="currentTheme" :ptOptions="ptOptions">
		<template #icon><slot name="icon" /></template>
		<template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
			<slot :name="name" v-bind="slotProps ?? {}" />
		</template>
	</Button>
</template>

<script setup>
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

import Button from 'primevue/button'

import { DEFAULT_BUTTON_THEME, CONTRAST_BUTTON_THEME } from './themes'

const props = defineProps({
	contrast: { type: Boolean, default: false },
})

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const currentTheme = computed(() => {
	return props.contrast ? CONTRAST_BUTTON_THEME : DEFAULT_BUTTON_THEME
})
</script>
