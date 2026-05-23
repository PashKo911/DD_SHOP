<template>
	<header-menu />
	<main class="pb-80-30 mb-80-30 relative grow">
		<separator-base class="absolute bottom-0 left-0" />
		<toast />
		<slot />
	</main>
	<subscribe-section />
	<app-footer />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useHead } from '@vueuse/head'
import { useRouter, useRoute } from 'vue-router'

import { useCommonStore } from '@/stores/common'
import { useStorage } from '@/composables/useStorage'

import { i18nMeta } from '@/config/i18n'
import getPathForLocale from '@/utils/locale/getPathForLocale'

import HeaderMenu from '@/components/sections/header/HeaderMenu.vue'
import AppFooter from '@/components/sections/footer/AppFooter.vue'
import Toast from '@/components/ui/feedback/Toast.vue'
import SubscribeSection from '@/components/sections/subscribeSection/SubscribeSection.vue'
import SeparatorBase from '@/components/ui/separators/SeparatorBase.vue'

const router = useRouter()
const route = useRoute()

const commonStore = useCommonStore()
const { locale } = storeToRefs(commonStore)
const { setCurrency } = commonStore
const { onStorageEvent } = useStorage()

window.addEventListener('storage', onStorageEvent)

const linkTags = computed(() => {
	const canonical = {
		rel: 'canonical',
		href: getPathForLocale(locale.value, router, route),
	}

	const alternates = i18nMeta.localeCodes.map((l) => ({
		rel: 'alternate',
		hreflang: l,
		href: getPathForLocale(l, router, route),
	}))

	alternates.push({
		rel: 'alternate',
		hreflang: 'x-default',
		href: getPathForLocale(i18nMeta.defaultLocale, router, route),
	})

	return [canonical, ...alternates]
})

useHead(() => ({
	htmlAttrs: { lang: locale.value },
	link: linkTags.value,
}))
//========================================================================================================================================================
onMounted(() => {
	setCurrency()
})

onBeforeUnmount(() => {
	window.removeEventListener('storage', onStorageEvent)
})
</script>
