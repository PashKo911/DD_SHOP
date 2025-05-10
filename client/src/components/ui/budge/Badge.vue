<template>
	<Badge unstyled :pt="DEFAULT_BADGE_THEME" :ptOptions="ptOptions">
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</Badge>
</template>

<script setup>
import Badge from 'primevue/badge'
import { computed } from 'vue'
import { DEFAULT_BADGE_THEME } from './themes'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))
</script>
