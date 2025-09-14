<template>
	<Button
		plain
		variant="text"
		aria-haspopup="true"
		rounded
		aria-controls="overlay_menu"
		@click="toggle"
		class="focus-visible:outline-t-inverse-hover [&:has(+_.wrp)]:text-t-inverse-hover relative aspect-square w-[36px] py-0! outline-1"
	>
		<template #icon>
			<img
				v-if="userData.avatar"
				:src="userData.avatar"
				:alt="userData.name"
				@error="userData.avatar = null"
				class="h-full w-full"
			/>
			<span
				v-else
				class="text-creamy-cloud absolute inset-0 grid place-items-center bg-[#555]"
			>
				<span>
					{{ userData.name[0].toUpperCase() }}
				</span>
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
		<template #item="{ item }">
			<button-link
				:label="t(item.label)"
				size="small"
				variant="text"
				class="w-max"
				:to="{ name: item.routeName }"
			>
				<template #icon>
					<component :is="item.icon" width="1.25rem" height="1.25rem" />
				</template>
			</button-link>
		</template>
		<template #end>
			<Button
				:label="t('buttons.signout')"
				size="small"
				variant="text"
				@click="$emit('signout')"
				class="w-max"
			>
				<template #icon>
					<log-out-icon />
				</template>
			</Button>
		</template>
	</Menu>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import userMenuItems from '@/data/userMenuItems'

import Button from '@/components/ui/buttons/Button.vue'
import Menu from '@/volt/Menu.vue'
import ButtonLink from '../ui/buttons/ButtonLink.vue'
import LogOutIcon from '@/components/icons/LogOutIcon.vue'

const props = defineProps({
	userData: {
		type: Object,
		required: true,
	},
})

const emits = defineEmits(['signout'])
//========================================================================================================================================================

const { t } = useI18n()
const menu = ref()
//========================================================================================================================================================

const toggle = (event) => {
	menu.value.toggle(event)
}
</script>
