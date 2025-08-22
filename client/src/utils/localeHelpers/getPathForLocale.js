import { SITE_BASE } from '@/constants/config'

function getPathForLocale(targetLocale, router, route) {
	const params = { ...route.params, locale: targetLocale }
	const resolved = router.resolve({ name: route.name, params })

	return new URL(resolved.href, SITE_BASE).href
}

export default getPathForLocale
