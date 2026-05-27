import { i18nMeta } from '@/config/i18n'

export function getLocaleFromPath(path = window.location.pathname) {
	const match = path.match(/^\/(en|uk)(?:\/|$)/)?.[1]
	return i18nMeta.localeCodes.includes(match) ? match : i18nMeta.defaultLocale
}
