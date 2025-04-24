<template>
	<ContrastButton
		type="button"
		severity="secondary"
		fluid
		size="large"
		:label="$t('buttons.googleButton')"
	>
		<template #icon>
			<google-icon class="shrink-0" />
		</template>
	</ContrastButton>
</template>

<script setup>
import ContrastButton from '@/volt/ContrastButton.vue'
import GoogleIcon from '@/components/icons/GoogleIcon.vue'
</script>
