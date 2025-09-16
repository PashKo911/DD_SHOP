import apiConfig from '@/config/api'

function getPathForLocale(targetLocale, router, route) {
	const params = { ...route.params, locale: targetLocale }
	const resolved = router.resolve({ name: route.name, params })

	return new URL(resolved.href, apiConfig.siteBase).href
}

export default getPathForLocale
