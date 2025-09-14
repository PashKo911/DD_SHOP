import SignInIcon from '@/components/icons/SignInIcon.vue'
import ListIcon from '@/components/icons/ListIcon.vue'

const userMenuItems = [
	{
		separator: true,
	},
	{
		id: 1,
		label: 'partials.userMenu.info',
		routeName: 'home',
		icon: SignInIcon,
	},
	{
		id: 2,
		label: 'partials.userMenu.dashboard',
		routeName: 'home',
		icon: ListIcon,
	},
	{
		separator: true,
	},
]

export default userMenuItems
