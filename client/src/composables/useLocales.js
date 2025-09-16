import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import routeNames from '@/router/routeNames'

import { i18nMeta } from '@/config/i18n'

export function useLocales() {
	const { locale } = useI18n()
	const router = useRouter()
	const route = useRoute()

	function setLocale(lang) {
		if (locale.value === lang) return

		locale.value = lang
		localStorage.setItem('locale', lang)

		router.push({
			name: route.name || routeNames.HOME,
			params: { ...route.params, locale: lang },
			query: route.query,
		})
	}
	function checkLocale() {
		const storageLocale = localStorage.getItem('locale')

		if (storageLocale && storageLocale !== locale.value) {
			setLocale(storageLocale)
			return
		}

		locale.value = i18nMeta.defaultLocale
	}

	window.addEventListener('storage', () => checkLocale())

	return {
		setLocale,
		checkLocale,
	}
}
