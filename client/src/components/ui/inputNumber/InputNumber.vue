<template>
	<InputNumber unstyled :pt="DEFAULT_INPUT_NUMBER_THEME" :ptOptions="ptOptions">
		<template #incrementicon>
			<slot name="incrementicon">
				<PlusIcon />
			</slot>
		</template>
		<template #decrementicon>
			<slot name="decrementicon">
				<MinusIcon />
			</slot>
		</template>
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</InputNumber>
</template>

<script setup>
import { DEFAULT_INPUT_NUMBER_THEME } from './themes'

import MinusIcon from '@primevue/icons/minus'
import PlusIcon from '@primevue/icons/plus'
import InputNumber from 'primevue/inputnumber'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))
</script>
