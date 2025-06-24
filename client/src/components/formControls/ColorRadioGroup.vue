<template>
	<radio-group
		v-model="model"
		:items="items"
		:multiple="multiple"
		:aria-label="t('accessibility.colorRadioGroup.title')"
		:group-class="`flex flex-wrap ${groupClassBySize}`"
		label-class="relative rounded-full outline-1 outline-offset-2 outline-transparent group focus-visible:outline-primary transition-colors"
	>
		<template #item="{ item, checked }">
			<span
				:style="{ backgroundColor: item.value }"
				class="grid aspect-square cursor-pointer place-items-center rounded-full shadow-lg transition-shadow duration-300 peer-checked:shadow-none hover:shadow-md"
				:class="
				buttonClassBySize,
				{
					'hover:shadow-none': checked,
				}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="aspect-[16/11] w-[40%]"
					viewBox="0 0 16 11"
					fill="none"
				>
					<path
						ref="checkPath"
						d="M1 5 L6 10 L15 1"
						stroke="white"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="transition-[stroke-dashoffset] duration-300 ease-in-out group-checked:opacity-100"
						:style="{
							'stroke-dasharray': totalPathLength,
							opacity: checked ? 1 : 0,
							'stroke-dashoffset': checked ? 0 : totalPathLength,
						}"
					/>
				</svg>
			</span>
		</template>
	</radio-group>
</template>

<script setup>
import { computed, ref } from 'vue'
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
	size: {
		type: String,
		default: 'middle',
	},
})

const checkPath = ref('checkPath')

const totalPathLength = computed(() => {
	if (typeof checkPath.value !== 'string') {
		return checkPath.value?.getTotalLength()
	}
	return null
})
const buttonClassBySize = computed(() => {
	switch (props.size) {
		case 'small':
			return 'w-6.5'
		case 'large':
			return 'w-13'

		default:
			return 'w-10'
	}
})
const groupClassBySize = computed(() => {
	 switch(props.size){
		case 'small':
		return 'gap-1.5'

		case 'large': 
		return 'gap-4'

		default: 
		return 'gap-3'
	}
})
</script>
