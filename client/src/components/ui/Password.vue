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

const DEFAULT_PASSWORD_THEME = {
	root: `inline-flex relative p-fluid:flex`,
	pcInputText: {
		root: `appearance-none rounded-md outline-hidden
      bg-primary p-filled:bg-surface-50 text-creamy-cloud font-heading leading-[1.2] 
      placeholder:text-creamy-cloud focus:placeholder:opacity-0 placeholder:transition-opacity
      placeholder:duration-300 border-2 border-primary
      enabled:hover:border-t-inverse-hover enabled:focus:border-t-inverse-hover
      disabled:bg-surface-200 disabled:text-surface-500
      p-invalid:border-red-400 p-invalid:placeholder:text-red-600
      px-3 py-2 p-fluid:w-full p-has-e-icon:pe-10
      p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
      p-large:text-24-18 p-large:px-[0.875rem] py-4 p-large:rounded-lg
      transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
	},
	overlay: `p-3 rounded-md p-portal-self:min-w-full
    bg-primary border border-surface-200 text-creamy-cloud
    shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]`,
	content: `flex flex-col gap-2`,
	meter: `h-3 bg-surface-200 rounded-md`,
	meterLabel: `h-full w-0 transition-[width] duration-1000 ease-in-out rounded-md
    p-weak:bg-red-500 p-medium:bg-amber-500 p-strong:bg-green-500`,
	meterText: `font-bold`,
	transition: {
		enterFromClass: 'opacity-0 scale-y-75',
		enterActiveClass: 'transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]',
		leaveActiveClass: 'transition-opacity duration-100 ease-linear',
		leaveToClass: 'opacity-0',
	},
}

const CONTRAST_PASSWORD_THEME = {
	root: DEFAULT_PASSWORD_THEME.root,
	pcInputText: {
		...DEFAULT_PASSWORD_THEME.pcInputText,
		root: DEFAULT_PASSWORD_THEME.pcInputText.root
			.replace('bg-primary', 'bg-inverse')
			.replace('text-creamy-cloud', 'text-primary')
			.replace('placeholder:text-creamy-cloud', 'placeholder:text-surface-300'),
	},
	overlay: DEFAULT_PASSWORD_THEME.overlay
		.replace('bg-primary', 'bg-creamy-cloud')
		.replace('text-creamy-cloud', 'text-surface-700'),
	content: DEFAULT_PASSWORD_THEME.content,
	meter: DEFAULT_PASSWORD_THEME.meter,
	meterLabel: DEFAULT_PASSWORD_THEME.meterLabel,
	meterText: DEFAULT_PASSWORD_THEME.meterText,
	transition: DEFAULT_PASSWORD_THEME.transition,
}

const theme = computed(() =>
	props.contrast ? CONTRAST_PASSWORD_THEME : DEFAULT_PASSWORD_THEME,
)
</script>
