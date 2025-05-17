<template>
	<radio-group
		v-model="model"
		:multiple="multiple"
		:items="items"
		:aria-label="t('accessibility.sizeRadioGroup.title')"
		group-class="flex gap-3 flex-wrap"
		label-class="relative rounded-sm outline-1  outline-offset-2 outline-transparent focus-visible:outline-primary transition-colors duration-300"
		span-class="font-heading peer-checked:border-primary grid min-h-10 min-w-[3.5rem] cursor-pointer place-items-center rounded-sm border border-transparent bg-[#FCF9F6] px-2 py-1 text-xl leading-tight uppercase shadow-lg transition-all duration-300 peer-checked:shadow-none hover:shadow-md peer-checked:hover:shadow-none"
	/>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import RadioGroup from '@/components/ui/radioGroup/RadioGroup.vue'

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
