<template>
	<div
		class="flex flex-col-reverse items-start justify-between gap-5 lg:flex-row lg:gap-8"
	>
		<div class="flex flex-wrap items-center gap-2">
			<chip
				v-for="i in items"
				:key="i.value"
				:label="i.label"
				removable
				@remove="onRemove(i)"
			/>
		</div>
		<button
			v-show="items.length"
			@click="removeAll"
			@keydown="removeAll"
			class="bg-primary focus-visible:outline-primary group font-heading relative inline-flex shrink-0 cursor-pointer items-center gap-2 self-end rounded-md ps-3 outline-transparent focus-visible:outline-1 focus-visible:outline-offset-2 lg:self-start"
		>
			<span class="text-primary z-[2] capitalize">{{
				t('buttons.clearAllFilterChips')
			}}</span>
			<div class="grid h-8 w-8 place-items-center rounded-md">
				<close-icon
					class="fill-primary z-[2] h-3 w-3 transition-colors duration-300 group-hover:fill-red-400 group-focus-visible:fill-red-400"
				/>
			</div>
			<i
				class="bg-creamy-cloud absolute inset-[.1875rem] block rounded-[.4688rem]"
			></i>
		</button>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Chip from '@/components/ui/Chip.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'

defineProps({
	items: {
		type: Array,
		default: [],
	},
})

const emit = defineEmits(['remove', 'removeAll'])

const { t } = useI18n()

const onRemove = (val) => {
	emit('remove', val)
}
const removeAll = () => {
	emit('removeAll')
}
</script>
