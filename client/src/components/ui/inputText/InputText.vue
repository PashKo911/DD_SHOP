<template>
	<InputText unstyled :pt="currentTheme" :ptOptions="ptOptions" />
</template>

<script setup>
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import { ptViewMerge } from '@/utils/volt'
import { DEFAULT_THEME, CONTRAST_THEME, ICON_FIELD_THEME } from './themes'

const props = defineProps({
	contrast: { type: Boolean, default: false },
	iconField: { type: Boolean, default: false },
})

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const currentTheme = computed(() => {
	if (props.contrast) return CONTRAST_THEME
	if (props.iconField) return ICON_FIELD_THEME
	return DEFAULT_THEME
})
</script>
