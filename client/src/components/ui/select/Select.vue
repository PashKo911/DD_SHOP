<template>
	<Select unstyled :pt="currentTheme" :ptOptions="ptOptions">
		<template #dropdownicon>
			<ChevronDownIcon />
		</template>
		<template #loadingicon>
			<SpinnerIcon class="animate-spin" />
		</template>
		<template #filtericon>
			<SearchIcon class="text-surface-400" />
		</template>
		<template #clearicon>
			<TimesIcon class="text-surface-400 absolute end-10 top-1/2 -mt-2" />
		</template>
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</Select>
</template>

<script setup>
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'
import { TRANSPARENT_SELECT_THEME } from './themes'
import { DEFAULT_SELECT_THEME } from './themes'

import ChevronDownIcon from '@primevue/icons/chevrondown'
import SearchIcon from '@primevue/icons/search'
import SpinnerIcon from '@primevue/icons/spinner'
import TimesIcon from '@primevue/icons/times'
import Select from 'primevue/select'

const props = defineProps({
	transparent: { type: Boolean, default: false },
})

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const currentTheme = computed(() =>
	props.transparent ? TRANSPARENT_SELECT_THEME : DEFAULT_SELECT_THEME,
)
</script>
