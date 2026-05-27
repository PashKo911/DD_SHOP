import { createI18n } from 'vue-i18n'
import { i18nConfig } from '@/config/i18n'

let i18n

export function initI18n() {
	i18n = createI18n({
		...i18nConfig,
	})

	return i18n
}

export { i18n }
