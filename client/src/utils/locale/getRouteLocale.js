import { i18nMeta } from '@/config/i18n'

export function getRouteLocale(route) {
	const locale = route?.params?.locale

	return i18nMeta.localeCodes.includes(locale)
		? locale
		: i18nMeta.defaultLocale
}
