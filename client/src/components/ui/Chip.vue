<template>
	<Chip unstyled :pt="theme" :ptOptions="ptOptions">
		<template #removeicon="{ removeCallback, keydownCallback }">
			<button
				type="button"
				:aria-label="t('buttons.clearFilterChip')"
				@click="removeCallback"
				@keydown="keydownCallback"
				class="group focus-visible:outline-primary grid h-8 w-8 cursor-pointer place-items-center rounded-md focus-visible:outline focus-visible:outline-offset-2"
			>
				<close-icon
					class="h-3 w-3 fill-white transition-colors duration-300 group-hover:fill-red-400 group-focus-visible:fill-red-400"
				/>
			</button>
		</template>
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</Chip>
</template>

<script setup>
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

import { useI18n } from 'vue-i18n'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import Chip from 'primevue/chip'

const { t } = useI18n()

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const theme = {
	root: `inline-flex items-center rounded-md gap-2 ps-3 
        bg-primary font-heading
        text-white capitalize
        has-[img]:pt-1 has-[img]:pb-1
		`,
	image: `rounded-full w-8 h-8 -ms-2`,
	icon: ``,
}
// p-removable:pe-2
</script>
