<template>
	<div class="border-border-color rounded-2xl border bg-white p-9">
		<div
			class="border-border-color flex items-center justify-between gap-8 border-b pb-8"
		>
			<h2 class="font-heading text-24-18 leading-tight font-bold">
				{{ t('pages.shop.filter.title') }}
			</h2>
			<filter-icon />
		</div>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import FilterIcon from '@/components/icons/FilterIcon.vue'

const { t } = useI18n()
</script>
