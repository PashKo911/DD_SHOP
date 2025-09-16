<template>
	<Select
		v-model="selectedLanguage"
		:options="languages"
		:tabindex="0"
		:ariaLabel="t('accessibility.languageSelect')"
		optionLabel="name"
		size="small"
		transparent
		append-to="self"
	>
		<template #value="slotProps">
			<div v-if="slotProps.value" class="flex items-center">
				<component
					:is="slotProps.value?.flag"
					class="mr-2 h-[1.125rem] w-[1.125rem] shrink-0 -translate-y-[.1062rem]"
				/>
				<div class="uppercase">{{ slotProps.value?.name }}</div>
			</div>
			<span v-else>
				{{ slotProps.placeholder }}
			</span>
		</template>
		<template #option="slotProps">
			<div class="flex items-center">
				<component
					:is="slotProps.option?.flag"
					class="mr-2 h-[1.125rem] w-[1.125rem] shrink-0"
				/>
				<div class="uppercase">{{ slotProps.option?.name }}</div>
			</div>
		</template>
	</Select>
</template>

<script setup>
import { computed } from 'vue'

import { useI18n } from 'vue-i18n'
import { useLocales } from '@/composables/useLocales'
import { i18nMeta } from '@/config/i18n'

import Select from '@/components/ui/Select.vue'

const { t, locale } = useI18n()

const { setLocale } = useLocales()

const languages = computed(() => {
	return Object.entries(i18nMeta.supportedLocales).map(([code, locale]) => ({
		name: locale.displayCode,
		code,
		flag: locale.flag,
	}))
})

const selectedLanguage = computed({
	get() {
		return languages.value.find((l) => l.code === locale.value)
	},
	set(newVal) {
		setLocale(newVal.code)
	},
})
</script>
