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
					class="hover:text-t-hover underline decoration-transparent transition-colors"
				>
					<span>{{ item.label }}</span>
				</a>
			</router-link>
			<span
				v-else
				v-bind="props.action"
				class="text-t-hover font-bold underline decoration-auto underline-offset-2"
			>
				<span>{{ item.label }}</span>
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

const items = computed(() =>
	route.matched.map((r, i, arr) => ({
		label: t(r.meta?.localeName),
		route: { name: r.name },
		isLast: i === arr.length - 1,
	})),
)

const { t } = useI18n()

const home = computed(() => ({
	label: t('partials.pageTitles.shop'),
	route: { name: 'shop' },
}))
</script>
