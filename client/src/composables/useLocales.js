import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

import { DEFAULT_LOCALE } from '@/constants/config'

export function useLocales() {
	const { locale } = useI18n()
	const router = useRouter()
	const route = useRoute()

	function setLocale(lang) {
		if (locale.value === lang) return

		locale.value = lang
		localStorage.setItem('lastLocale', lang)

		router.push({
			name: route.name || 'home',
			params: { ...route.params, locale: lang },
			query: route.query,
		})
	}
	function checkLocale() {
		const storageLocale = localStorage.getItem('lastLocale')

		if (storageLocale && storageLocale !== locale.value) {
			setLocale(storageLocale)
			return
		}

		locale.value = DEFAULT_LOCALE
	}

	window.addEventListener('storage', () => checkLocale())

	return {
		setLocale,
		checkLocale,
	}
}
