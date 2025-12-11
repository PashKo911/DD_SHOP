<template>
	<div class="grid gap-8">
		<div class="flex items-center gap-4">
			<input-number
				v-model="localPrice[0]"
				:min="min"
				:max="localPrice[1] - 1"
				:invalid="!isValid"
				size="small"
				mode="currency"
				:currency="currency"
				:locale="locale"
				currencyDisplay="symbol"
				showButtons
				:maxFractionDigits="0"
				@input="onInput($event, 0)"
				class="w-full"
			>
				<template #incrementicon>
					<ChevronUpIcon />
				</template>
				<template #decrementicon>
					<ChevronDownIcon />
				</template>
			</input-number>
			<input-number
				v-model="localPrice[1]"
				:min="localPrice[0] + 1"
				:max="max"
				:invalid="!isValid"
				size="small"
				mode="currency"
				:currency="currency"
				:locale="locale"
				currencyDisplay="symbol"
				showButtons
				:maxFractionDigits="0"
				@input="onInput($event, 1)"
				class="w-full"
			>
				<template #incrementicon>
					<ChevronUpIcon />
				</template>
				<template #decrementicon>
					<ChevronDownIcon />
				</template>
			</input-number>
		</div>
		<div class="px-2.5">
			<slider-number
				v-model="localPrice"
				range
				:min="min"
				:max="max"
				@slideend="onPriceChange"
				class="w-full"
			/>
		</div>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, computed, watch, onMounted } from 'vue'
import debounce from '@/utils/debounce'
import { useCommonStore } from '@/stores/common'

import InputNumber from '@/components/ui/InputNumber.vue'
import SliderNumber from '@/components/sliderNumber/SliderNumber.vue'
import ChevronDownIcon from '@primevue/icons/chevrondown'
import ChevronUpIcon from '@primevue/icons/chevronup'
import { storeToRefs } from 'pinia'

const props = defineProps({
	min: {
		type: Number,
		default: 0,
	},
	max: {
		type: Number,
		default: 100,
	},
})

const price = defineModel()
const localPrice = ref([props.min, props.max])

const { numberFormats } = useI18n()
const commonStore = useCommonStore()

const { locale } = storeToRefs(commonStore)

const currency = computed(() => {
	const { currency } = numberFormats.value[locale.value]
	return currency.currency
})

const isValid = computed(() => {
	const [minPrice, maxPrice] = localPrice.value
	return minPrice < maxPrice
})

watch(
	() => price.value,
	() => {
		if (!price.value.length) {
			localPrice.value = [props.min, props.max]
			return
		}
		localPrice.value = [...price.value]
	},
)

watch(
	() => [props.min, props.max],
	() => {
		localPrice.value = [props.min, props.max]
	},
)
watch(localPrice, ([newMin, newMax], [prevMin, prevMax]) => {
	if (newMin >= newMax) {
		localPrice.value = [prevMin, prevMax]
	}
})

const onPriceChange = ({ value }) => {
	if (!isValid.value) return
	price.value = value
}
const debouncedPriceChange = debounce(onPriceChange)
function onInput({ value }, idx) {
	localPrice.value[idx] = value
	debouncedPriceChange({ value: [...localPrice.value] })
}
//========================================================================================================================================================
onMounted(() => {
	if (price.value.length) {
		localPrice.value = [...price.value]
	}
})
</script>
