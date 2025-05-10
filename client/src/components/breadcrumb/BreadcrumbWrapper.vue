<template>
	<Breadcrumb :home="home" :model="items">
		<template #item="{ item, props }">
			<router-link
				v-if="!item.isLast"
				v-slot="{ href, navigate }"
				:to="item.route"
				custom
			>
				<a
					:href="href"
					v-bind="props.action"
					@click="navigate"
					class="hover:text-t-hover capitalize underline decoration-transparent transition-colors"
				>
					<span>{{ t(item.label) }}</span>
				</a>
			</router-link>
			<span
				v-else
				v-bind="props.action"
				class="text-t-hover font-bold capitalize"
			>
				<span>{{ t(item.label) }}</span>
			</span>
		</template>
	</Breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

const route = useRoute()
const { t } = useI18n()

const items = computed(() =>
	route.matched
		.filter((record) => record.meta?.localeName != null)
		.map((record, index, arr) => ({
			label:
				typeof record.meta.localeName === 'function'
					? record.meta.localeName(route)
					: record.meta.localeName,
			route: { name: record.name },
			isLast: index === arr.length - 1,
		})),
)

const home = computed(() => ({
	label: 'pages.home.title.menu',
	route: { name: 'home' },
}))
</script>
