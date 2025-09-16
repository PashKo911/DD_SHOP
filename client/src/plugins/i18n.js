import { createI18n } from 'vue-i18n'
import router from '@/router'
import detectLocale from '@/utils/localeHelpers/detectLocale'
import { i18nConfig } from '@/config/i18n'

let i18n

export async function initI18n() {
	await router.isReady()

	const locale = detectLocale(router.currentRoute.value)

	i18n = createI18n({
		...i18nConfig,
		locale,
	})

	return i18n
}

export { i18n }
