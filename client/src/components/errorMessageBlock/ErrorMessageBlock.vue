<template>
	<div
		class="p-50-15 stroke-dark-grey grid content-center justify-center gap-4 rounded-lg bg-white"
	>
		<refresh-alert class="mx-auto w-25" />
		<h2 class="font-heading text-24-18 font-bold">
			{{ t('partials.errorBlockTitle') }}
		</h2>
		<Button
			:label="t('buttons.reloadButton')"
			:disabled="isLoading"
			@click="$emit('reloadItems')"
		/>
	</div>
</template>

<script setup>
import RefreshAlert from '../icons/RefreshAlert.vue'
import Button from '../ui/buttons/Button.vue'

import { useI18n } from 'vue-i18n'

defineEmits(['reloadItems'])

defineProps({
	isLoading: {
		type: Boolean,
		default: false,
	},
})

const { t } = useI18n()
</script>
