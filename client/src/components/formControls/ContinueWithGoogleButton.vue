<template>
	<Button
		type="button"
		severity="secondary"
		fluid
		:contrast="isContrast"
		size="large"
		:label="$t('buttons.googleButton')"
	>
		<template #icon>
			<google-icon class="relative shrink-0" />
		</template>
	</Button>
</template>

<script setup>
import Button from '@/components/ui/button/Button.vue'
import GoogleIcon from '@/components/icons/GoogleIcon.vue'

const props = defineProps({
	isContrast: {
		type: Boolean,
		default: true,
	},
})
</script>
