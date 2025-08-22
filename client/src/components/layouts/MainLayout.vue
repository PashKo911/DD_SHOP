<template>
	<header-menu />
	<main
		class="pb-80-30 mb-80-30 relative grow pt-[7.6875rem] md:pt-[9.4375rem] lg:pt-[6.1875rem]"
	>
		<separator-base class="absolute bottom-0 left-0" />
		<toast />
		<slot />
	</main>
	<subscribe-section />
	<app-footer />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@vueuse/head'
import { localeCodes } from '@/config/i18nConfig'
import { DEFAULT_LOCALE } from '@/constants/config'
import getPathForLocale from '@/utils/localeHelpers/getPathForLocale'

import HeaderMenu from '@/components/partials/header/HeaderMenu.vue'
import AppFooter from '@/components/partials/footer/AppFooter.vue'
import Toast from '@/components/ui/toast/Toast.vue'
import SubscribeSection from '@/components/partials/subscribeSection/SubscribeSection.vue'
import SeparatorBase from '@/components/separators/SeparatorBase.vue'

const router = useRouter()
const route = useRoute()

const { locale } = useI18n()

const linkTags = computed(() => {
	const canonical = {
		rel: 'canonical',
		href: getPathForLocale(locale.value, router, route),
	}

	const alternates = localeCodes.map((l) => ({
		rel: 'alternate',
		hreflang: l,
		href: getPathForLocale(l, router, route),
	}))

	alternates.push({
		rel: 'alternate',
		hreflang: 'x-default',
		href: getPathForLocale(DEFAULT_LOCALE, router, route),
	})

	return [canonical, ...alternates]
})

useHead(() => ({
	htmlAttrs: { lang: locale.value },
	link: linkTags.value,
}))
</script>
