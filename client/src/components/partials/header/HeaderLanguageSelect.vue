<template>
	<Select
		v-model="selectedLanguage"
		@update:modelValue="(val) => setLocale(val.code)"
		:options="languages"
		optionLabel="name"
		size="small"
		:tabindex="0"
		transparent
		append-to="self"
		:ariaLabel="t('accessibility.languageSelect')"
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
import { ref, markRaw } from 'vue'

import { useI18n } from 'vue-i18n'
import { useLocales } from '@/composables/useLocales'

import Select from '@/components/ui/select/Select.vue'
import UaFlagIcon from '@/components/icons/UaFlagIcon.vue'
import UsaFlagIcon from '@/components/icons/UsaFlagIcon.vue'

const { setLocale, locale } = useLocales()
const { t } = useI18n()

const languages = ref([
	{ name: 'UA', code: 'uk', flag: markRaw(UaFlagIcon) },
	{ name: 'EN', code: 'en', flag: markRaw(UsaFlagIcon) },
])

const selectedLanguage = ref(
	languages.value.find((l) => l.code === locale.value) || locale.value,
)
</script>
