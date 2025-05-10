<template>
	<Password unstyled :pt="theme" :ptOptions="ptOptions">
		<template #maskicon="{ toggleCallback }">
			<EyeSlashIcon
				@click="toggleCallback"
				:aria-label="t('accessibility.passwordFieldTips.hidePassword')"
				class="text-surface-500 absolute end-3 top-1/2 -mt-2 h-4 w-4 cursor-pointer"
			/>
		</template>
		<template #unmaskicon="{ toggleCallback }">
			<EyeIcon
				@click="toggleCallback"
				:aria-label="t('accessibility.passwordFieldTips.showPassword')"
				class="text-surface-500 absolute end-3 top-1/2 -mt-2 h-4 w-4 cursor-pointer"
			/>
		</template>
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</Password>
</template>

<script setup>
import { DEFAULT_PASSWORD_THEME, CONTRAST_PASSWORD_THEME } from './themes'
import { useI18n } from 'vue-i18n'
import Password from 'primevue/password'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'
import EyeIcon from '@primevue/icons/eye'
import EyeSlashIcon from '@primevue/icons/eyeslash'

const { t } = useI18n()

const props = defineProps({
	contrast: { type: Boolean, default: false },
})

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const theme = computed(() =>
	props.contrast ? CONTRAST_PASSWORD_THEME : DEFAULT_PASSWORD_THEME,
)
</script>
