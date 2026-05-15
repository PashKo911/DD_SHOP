<template>
	<Tabs :value="props.value" unstyled :pt="theme" :ptOptions="ptOptions">
		<slot></slot>
	</Tabs>
</template>

<script setup>
import Tabs from 'primevue/tabs'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))
const props = defineProps()

const theme = {
	root: `flex flex-col`,
}
</script>
