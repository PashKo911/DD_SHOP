<template>
	<Button
		plain
		variant="text"
		aria-haspopup="true"
		rounded
		contrast
		aria-controls="overlay_menu"
		:aria-label="t('accessibility.userControl')"
		@click="toggle"
		class="focus-visible:outline-t-inverse-hover [&_span]:text-creamy-cloud! [&:has(+_.wrp)]:text-t-inverse-hover relative aspect-square w-[2.25rem] py-0! outline-1"
	>
		<template #icon>
			<img
				v-if="userData.avatar"
				:src="userData.avatar"
				:alt="userData.name"
				width="36"
				height="36"
				@error="userData.avatar = null"
				class="h-full w-full"
			/>
			<span
				v-else
				class="text-creamy-cloud absolute inset-0 grid place-items-center bg-[#555]"
			>
				{{ userData.name[0].toUpperCase() }}
			</span>
		</template>
	</Button>

	<Menu
		ref="menu"
		append-to="self"
		:model="userMenuItems"
		:popup="true"
		class="wrp"
	>
		<template #start>
			<div class="flex items-center gap-4">
				<div class="relative aspect-square w-16 overflow-hidden rounded-full">
					<img
						v-if="userData.avatar"
						:src="userData.avatar"
						:alt="userData.name"
						width="64"
						height="64"
						@error="userData.avatar = null"
						class="inset-0"
					/>
					<span
						v-else
						class="text-creamy-cloud font-heading absolute inset-0 grid place-items-center bg-[#555] text-[220%] font-semibold"
					>
						{{ userData.name[0].toUpperCase() }}
					</span>
				</div>
				<div class="grid gap-1">
					<div class="font-heading text-lg font-bold">
						{{ userData.name }}
					</div>
					<div class="text-sm">
						{{ userData.email }}
					</div>
				</div>
			</div>
		</template>
		<template #item="{ item, props }">
			<component
				:is="item.routeName ? 'RouterLink' : 'button'"
				v-bind="{
					...props.action,
					...(item.routeName
						? { to: { name: item.routeName } }
						: { onClick: item.command }),
				}"
			>
				<component :is="item.icon" width="1.25rem" height="1.25rem" />
				{{ t(item.label) }}
			</component>
		</template>
	</Menu>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import routeNames from '@/router/routeNames'

import Menu from '@/volt/Menu.vue'
import Button from '../ui/buttons/Button.vue'
import SignInIcon from '@/components/icons/SignInIcon.vue'
import ListIcon from '@/components/icons/ListIcon.vue'
import LogOutIcon from '@/components/icons/LogOutIcon.vue'

const props = defineProps({
	userData: {
		type: Object,
		required: true,
	},
})

const emit = defineEmits(['signout'])

const { t } = useI18n()
const menu = ref()

const userMenuItems = [
	{
		separator: true,
	},
	{
		id: 1,
		label: 'partials.userMenu.info',
		routeName: routeNames.HOME,
		icon: SignInIcon,
	},
	{
		id: 2,
		label: 'partials.userMenu.dashboard',
		routeName: routeNames.HOME,
		icon: ListIcon,
	},
	{
		separator: true,
	},
	{
		id: 3,
		label: 'buttons.signout',
		routeName: null,
		icon: LogOutIcon,
		command: () => {
			emit('signout')
		},
	},
]
//========================================================================================================================================================

const toggle = (event) => {
	menu.value.toggle(event)
}
</script>
