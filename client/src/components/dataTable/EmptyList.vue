<template>
	<div
		class="py-44-30 flex flex-col items-center justify-center gap-y-4 text-center"
	>
		<WarningIcon />
		<h2 class="text-24-18 font-heading text-primary font-bold">
			<slot name="title">
				{{ t('accessibility.table.emptyTitle') }}
			</slot>
		</h2>
		<p class="mb-4 text-sm text-gray-500 opacity-80">
			<slot name="text">
				{{ t('accessibility.table.emptyText') }}
			</slot>
		</p>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import WarningIcon from '../icons/WarningIcon.vue'

const { t } = useI18n()
</script>
