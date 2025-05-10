<template>
	<Toast unstyled :pt="DEFAULT_MESSAGE_THEME" :ptOptions="ptOptions">
		<template #closeicon>
			<TimesIcon />
		</template>
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</Toast>
</template>

<script setup>
import { DEFAULT_MESSAGE_THEME } from './themes'
import TimesIcon from '@primevue/icons/times'
import Toast from 'primevue/toast'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))
</script>
