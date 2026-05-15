<template>
	<TabPanel :value="props.value" unstyled :pt="theme" :ptOptions="ptOptions">
		<slot></slot>
	</TabPanel>
</template>

<script setup>
import TabPanel from 'primevue/tabpanel'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const props = defineProps()
const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const theme = {
	root: ``,
}
</script>
