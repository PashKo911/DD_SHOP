import router from '@/router'
import shopConstants from '@/constants/shop'
import routeNames from '@/router/routeNames'

export function getMenuItems() {
	const declaredRoutes = router.options.routes

	function recurse(routes) {
		return routes.flatMap((route) => {
			const fromChildren = route.children?.length ? recurse(route.children) : []

			let self = []
			if (route.name === routeNames.SHOP && route.meta?.useInMenu) {
				self = shopConstants.shopCategories.map((cat) => {
					return {
						name: routeNames.SHOP,
						params: { category: cat },
						label:
							typeof route.meta.localeName === 'function'
								? route.meta.localeName(cat)
								: route.meta.localeName,
					}
				})
			} else if (route.meta?.useInMenu && !route.children?.length) {
				self = [
					{
						name: route.name,
						params: {},
						label:
							typeof route.meta.localeName === 'function'
								? route.meta.localeName({ params: {} })
								: route.meta.localeName,
					},
				]
			}

			return [...self, ...fromChildren]
		})
	}

	const menuItems = recurse(declaredRoutes)

	return { menuItems }
}
