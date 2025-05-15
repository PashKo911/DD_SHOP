<template>
	<radio-group
		v-model="model"
		:items="items"
		:multiple="multiple"
		:aria-label="t('accessibility.colorRadioGroup.title')"
		group-class="flex gap-3 flex-wrap"
		label-class="relative flex gap-8 w-full items-center justify-between rounded-sm outline-1 outline-offset-2 outline-transparent group focus-visible:outline-primary transition-colors"
	>
		<template #item="{ item, checked }">
			<span
				class="font-heading hover:text-t-hover relative cursor-pointer text-xl leading-tight text-[#595656] capitalize duration-300"
				:class="{
					'text-t-hover': checked,
				}"
			>
				<i
					class="bg-t-hover absolute bottom-[.0625rem] h-0.5 w-0 transition-[width] duration-300"
					:class="{
						'w-full': checked,
					}"
				>
				</i>
				{{ t(item.label) }}
			</span>
			<arrow-right-icon
				class="group-hover:fill-t-hover aspect-squire order-2 w-8 duration-300"
				:class="{
					'fill-t-hover': checked,
				}"
			/>
		</template>
	</radio-group>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import RadioGroup from '@/components/ui/radioGroup/RadioGroup.vue'
import ArrowRightIcon from '../icons/ArrowRightIcon.vue'

const { t } = useI18n()

const model = defineModel()

const props = defineProps({
	items: {
		type: Array,
		required: true,
	},
	multiple: {
		type: Boolean,
		default: false,
	},
})
</script>
