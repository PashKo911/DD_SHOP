import { computed } from 'vue'
import router from '@/router'

const SHOP_CATEGORIES = ['women', 'men']

export function useMenuItems() {
	const declaredRoutes = router.options.routes

	function recurse(routes) {
		return routes.flatMap((route) => {
			const fromChildren = route.children?.length ? recurse(route.children) : []

			let self = []
			if (route.name === 'shop' && route.meta?.useInMenu) {
				self = SHOP_CATEGORIES.map((cat) => ({
					name: 'shop',
					params: { category: cat },
					label:
						typeof route.meta.localeName === 'function'
							? route.meta.localeName({ params: { category: cat } })
							: route.meta.localeName,
				}))
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

	const menuItems = computed(() => recurse(declaredRoutes))

	return { menuItems }
}
