<template>
	<Select
		:options="currencies"
		size="small"
		:default-value="currencyValue"
		transparent
		:ariaLabel="t('accessibility.currencySelect')"
		@change="onCurrencyChange"
	>
		<template #value="slotProps">
			{{ slotProps.value.symbol }}
			{{ slotProps.value.code }}
		</template>
		<template #option="slotProps">
			{{ slotProps.option.symbol }}
			{{ slotProps.option.code }}
		</template>
	</Select>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useCommonStore } from '@/stores/common'
import { currencies } from '@/constants/currencies'
import Select from '@/components/ui/Select.vue'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const commonStore = useCommonStore()

const { currencyValue } = storeToRefs(commonStore)
const { setCurrency } = commonStore

const onCurrencyChange = ({ value }) => {
	setCurrency(value)
}
</script>
