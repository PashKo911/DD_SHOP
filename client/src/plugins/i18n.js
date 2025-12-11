import { createI18n } from 'vue-i18n'
import router from '@/router'
import detectLocale from '@/utils/localeHelpers/detectLocale'
import { i18nConfig } from '@/config/i18n'
import { useCommonStore } from '@/stores/common'

let i18n

export async function initI18n() {
	const { setLocale } = useCommonStore()
	await router.isReady()

	const locale = detectLocale(router.currentRoute.value)

	i18n = createI18n({
		...i18nConfig,
		locale,
	})
	setLocale(locale)
	return i18n
}

export { i18n }
