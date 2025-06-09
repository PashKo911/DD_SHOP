<template>
	<Chip unstyled :pt="theme" :ptOptions="ptOptions">
		<template #removeicon="{ removeCallback, keydownCallback }">
			<TimesCircleIcon
				class="text-surface-800 focus-visible:outline-primary h-4 w-4 cursor-pointer rounded-full text-base focus-visible:outline focus-visible:outline-offset-2"
				@click="removeCallback"
				@keydown="keydownCallback"
			/>
		</template>
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</Chip>
</template>

<script setup>
import TimesCircleIcon from '@primevue/icons/timescircle'
import Chip from 'primevue/chip'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const theme = {
	root: `inline-flex items-center rounded-2xl gap-2 px-3 py-2
        bg-surface-100
        text-surface-800
        has-[img]:pt-1 has-[img]:pb-1
        p-removable:pe-2`,
	image: `rounded-full w-8 h-8 -ms-2`,
	icon: `text-surface-800 text-base w-4 h-4`,
}
</script>
