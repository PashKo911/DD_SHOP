<template>
	<Breadcrumb :home="home" :model="items">
		<template #item="{ item, props }">
			<router-link
				v-if="item.route"
				v-slot="{ href, navigate }"
				:to="item.route"
				custom
			>
				<a
					:href="href"
					v-bind="props.action"
					@click="navigate"
					class="underline decoration-transparent transition-colors hover:decoration-inherit"
				>
					<span>{{ item.label }}</span>
				</a>
			</router-link>
			<span
				v-else
				v-bind="props.action"
				class="font-bold underline decoration-auto underline-offset-2"
			>
				<span>{{ item.label }}</span>
			</span>
		</template>
	</Breadcrumb>
</template>

<script setup>
import { ref } from 'vue'

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
const home = ref({
	label: 'Shop',
	route: '/',
})

defineProps({
	items: {
		type: Array,
		default: () => [{ label: 'Default' }],
	},
})
</script>
