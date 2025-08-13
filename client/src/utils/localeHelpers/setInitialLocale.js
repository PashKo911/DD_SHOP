import detectInitialLocale from './detectInitialLocale'

function setInitialLocale(i18n, router) {
	router.isReady().then(() => {
		i18n.global.locale.value = detectInitialLocale(router.currentRoute.value)
	})
}

export default setInitialLocale
