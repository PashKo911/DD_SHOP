import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { i18n } from '@/plugins/i18n'
import { i18nMeta } from '@/config/i18n'

import viewModeData from '@/data/viewMode'
import { currencies, defaultCurrency } from '@/constants/currencies'
import shopConstants from '@/constants/shop'

export const useCommonStore = defineStore('common', () => {
	const storedCurrency = localStorage.getItem(
		shopConstants.storageKeys.currency,
	)
	const currency = ref(storedCurrency || defaultCurrency)
	const viewMode = ref(viewModeData[0])
	const isHeaderMenuOpen = ref(false)

	//========================================================================================================================================================
	const locale = ref(i18nMeta.defaultLocale)

	const currencyValue = computed(() => {
		return currencies.find((c) => c.code === currency.value)
	})

	const viewModeValue = computed(() => {
		return viewMode.value
	})

	//========================================================================================================================================================

	function setLocale(lang) {
		locale.value = lang
		if (i18n?.global?.locale) {
			i18n.global.locale.value = lang
		}
	}

	const setCurrency = (newCurrency) => {
		if (newCurrency && newCurrency.code === currency.value) return

		const code =
			(typeof newCurrency === 'object' ? newCurrency.code : newCurrency) ||
			currency.value

		currency.value = code
		localStorage.setItem(shopConstants.storageKeys.currency, code)

		const fmt = {
			currency: {
				style: 'currency',
				currency: code,
				// currencyDisplay: 'narrowSymbol',
				currencyDisplay: 'symbol',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			},
		}
		i18n.global.mergeNumberFormat(locale.value, fmt)
	}

	const setViewMode = (mode) => {
		viewMode.value = mode
	}

	const toggleHeaderMenu = () => {
		isHeaderMenuOpen.value = !isHeaderMenuOpen.value
	}

	return {
		// refs
		isHeaderMenuOpen,
		viewMode,
		currency,

		// computed
		viewModeValue,
		locale,
		currencyValue,

		// actions
		setLocale,
		setCurrency,
		toggleHeaderMenu,
		setViewMode,
	}
})
