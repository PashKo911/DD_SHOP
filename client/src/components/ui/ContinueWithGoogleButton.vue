<template>
	<component
		:is="currentComponent"
		type="button"
		severity="secondary"
		fluid
		size="large"
		:label="$t('buttons.googleButton')"
	>
		<template #icon>
			<google-icon class="relative shrink-0" />
		</template>
	</component>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import ContrastButton from '@/components/ui/ContrastButton.vue'
import Button from '@/components/ui/Button.vue'
import GoogleIcon from '@/components/icons/GoogleIcon.vue'

const props = defineProps({
	isContrast: {
		type: Boolean,
		default: true,
	},
})

const currentComponent = computed(() => {
	return props.isContrast ? ContrastButton : Button
})
</script>
